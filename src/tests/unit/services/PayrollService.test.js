import config from '../../../config';
import { StreamProvider, PayrollService } from '../../../services';
import {messages} from '../../../resources';
import util from 'util';
import EventEmitter from 'events';
import {RowFixture} from '../../fixtures';

let sandbox;
let streamProvider;
let target;
let dataRow;

describe('PayrollService', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    streamProvider = new StreamProvider();
    streamProvider.initialized = true;
    streamProvider.csvIn = new EventEmitter();
    streamProvider.csvOut = new EventEmitter();
    dataRow = RowFixture.new();
    streamProvider.csvOut.transform = (handler) => { handler(dataRow); return streamProvider.csvOut; };
    target = new PayrollService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('process', () => {
    describe('arguments', () => {
      it('should reject when tax year is invalid', () => {
        let taxYear = '2020-21';
        return expect(target.process(taxYear, streamProvider))
          .to.eventually.be.rejectedWith(messages.unknownTaxRules);
      });

      it('should use default when taxYear is null', () => {
        let promise = target.process(null, streamProvider);
        streamProvider.csvOut.emit('finish');
        return expect(promise)
          .to.eventually.be.fulfilled;
      });

      it('should use default when taxYear is empty', () => {
        let promise = target.process('', streamProvider);
        streamProvider.csvOut.emit('finish');
        return expect(promise)
          .to.eventually.be.fulfilled;
      });

      it('should reject when stream provider is null', () => {
        let taxYear = config.defaultRules;
        return expect(target.process(taxYear, null))
          .to.eventually.be.rejectedWith(util.format('%s:streamProvider', messages.arguments));
      });

      it('should reject stream provider is not initialized', () => {
        let taxYear = config.defaultRules;
        return expect(target.process(taxYear, {}))
          .to.eventually.be.rejectedWith(util.format('%s:streamProvider', messages.arguments));
      });
    });

    describe('lifecycle', () => {
      it('should reject on input error', () => {
        let taxYear = config.defaultRules;
        let err = new Error('input stream error');

        let promise = target.process(taxYear, streamProvider);
        streamProvider.csvIn.emit('error', err);

        return expect(promise)
          .to.eventually.be.rejectedWith(err);
      });

      it('should reject on output error', () => {
        let taxYear = config.defaultRules;
        let err = new Error('output stream error');

        let promise = target.process(taxYear, streamProvider);
        streamProvider.csvOut.emit('error', err);

        return expect(promise)
          .to.eventually.be.rejectedWith(err);
      });

      it('should resolve on output finished', () => {
        let taxYear = config.defaultRules;

        let promise = target.process(taxYear, streamProvider);
        streamProvider.csvOut.emit('finish');

        return expect(promise).to.eventually.be.fulfilled;
      });

      it('should call generate payslip', () => {
        let taxYear = config.defaultRules;
        sandbox.spy(target, 'generatePayslip');

        target.process(taxYear, streamProvider);
        streamProvider.csvOut.emit('finish');

        return expect(target.generatePayslip.calledOnce).to.be.true;
      });

      it('should emit payslip event', () => {
        let taxYear = config.defaultRules;
        sandbox.spy(target, 'generatePayslip');
        sandbox.spy(target, 'emit');

        target.process(taxYear, streamProvider);
        streamProvider.csvOut.emit('finish');

        return expect(target.emit.calledOnce).to.be.true;
      });
    });

    describe('tax calculation', () => {
      it('should apply the tax table rules', () => {
        const data = RowFixture.new();
        let tax = 120;
        let table = {
          apply: sandbox.spy(() => tax)
        };
        let actual = target.generatePayslip(data, table);
        expect(table.apply.calledOnce).to.be.true;
        return expect(actual.income_tax).to.equal(10);
      });

      it('should calculate gross correctly', () => {
        const data = RowFixture.new({
          annual_salary: 120
        });
        let tax = 0;
        let table = {
          apply: sandbox.spy(() => tax)
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.gross_income).to.equal(data.annual_salary / 12);
      });


      it('should calculate net correctly', () => {
        const data = RowFixture.new({
          annual_salary: 120
        });
        let tax = 120;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.net_income).to.equal(0);
      });

      it('should calculate super correctly', () => {
        const data = RowFixture.new({
          annual_salary: 120,
          super_rate: 0.1
        });
        let tax = 120;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.super_annuation).to.equal(1);
      });

      it('should round up gross', () => {
        const data = RowFixture.new({
          annual_salary: 126
        });
        let tax = 0;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.gross_income).to.equal(11);
      });

      it('should round down gross', () => {
        const data = RowFixture.new({
          annual_salary: 121
        });
        let tax = 0;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.gross_income).to.equal(10);
      });

      it('should round up tax', () => {
        const data = RowFixture.new({
          annual_salary: 10
        });
        let tax = 6;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.income_tax).to.equal(1);
      });

      it('should round down tax', () => {
        const data = RowFixture.new({
          annual_salary: 10
        });
        let tax = 3;
        let table = {
          apply:() => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.income_tax).to.equal(0);
      });

      it('should round up super', () => {
        const data = RowFixture.new({
          annual_salary: 10,
          super_rate: 0.5
        });
        let tax = 0;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.super_annuation).to.equal(1);
      });

      it('should round down super', () => {
        const data = RowFixture.new({
          annual_salary: 10,
          super_rate: 0.4
        });
        let tax = 0;
        let table = {
          apply: () => tax
        };
        let actual = target.generatePayslip(data, table);
        return expect(actual.super_annuation).to.equal(0);
      });
    });
  });
});
