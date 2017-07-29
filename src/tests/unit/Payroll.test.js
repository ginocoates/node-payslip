import PayrollService from '../../services/Payroll';
import { messages } from '../../resources';
import util from 'util';

let sandbox;
let target;
let fs;

describe('Payroll', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    target = new PayrollService();
    fs = require('fs');
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('Command Line Arguments', () => {
    it('should reject if no input file specified', () => {
      return expect(target.process(null))
        .to.eventually.be.rejectedWith(util.format(messages.arguments, 'inputFile'));
    });

    it('should reject if input file is empty', () => {
      return expect(target.process(''))
        .to.eventually.be.rejectedWith(util.format(messages.arguments, 'inputFile'));
    });
  });

  describe('IO', () => {
    it('should reject if the file is not found', () => {
      const ioError = new Error('File not found');
      const inputFile = 'nonexisting.csv';

      sandbox.stub(fs, 'open').rejects(ioError);

      return expect(target.process(inputFile))
        .to.eventually.be.rejectedWith(ioError);
    });
  });
});
