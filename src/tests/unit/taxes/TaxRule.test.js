import TaxRule from '../../../taxes/TaxRule';
import {messages} from '../../../resources';

let sandbox;

describe('PayrollService', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('test', () => {
    it('should return true if salary is between low and high band', () => {
      let bandLow = 0, bandHigh = 100, initial = 100, rate = 0.5, salary = 50;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.test(salary)).to.be.true;
    });

    it('should return false if salary less than low band', () => {
      let bandLow = 10, bandHigh = 100, initial = 100, rate = 0.5, salary = 5;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.test(salary)).to.be.false;
    });

    it('should return false if salary is greater than high band', () => {
      let bandLow = 10, bandHigh = 100, initial = 100, rate = 0.5, salary = 105;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.test(salary)).to.be.false;
    });

    it('should return true if salary is within top tax range', () => {
      let bandLow = 10, bandHigh = 0, initial = 100, rate = 0.5, salary = 15;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.test(salary)).to.be.true;
    });

    it('should return false if salary is null', () => {
      let bandLow = 10, bandHigh = 0, initial = 100, rate = 0.5, salary = null;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.test(salary)).to.be.false;
    });
  });

  describe('apply', () => {
    it('should raise an error if salary is null', () => {
      let bandLow = 10, bandHigh = 0, initial = 100, rate = 0.5, salary = null;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);

      try{
        target.apply(salary);
        return expect.fail('Expected exception');
      }catch(err){
        return expect(err.message).to.equal(messages.invalidSalary);
      }
    });

    it('should raise an error if salary is negative', () => {
      let bandLow = 10, bandHigh = 0, initial = 100, rate = 0.5, salary = -1;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);

      try{
        target.apply(salary);
        return expect.fail('Expected exception');
      }catch(err){
        return expect(err.message).to.equal(messages.invalidSalary);
      }
    });

    it('should calculate tax correctly', () => {
      let bandLow = 1, bandHigh = 2, initial = 1, rate = 1, salary = 2;
      let target = new TaxRule(bandLow, bandHigh, initial, rate);
      return expect(target.apply(salary)).to.equal(1);
    });
  });
});
