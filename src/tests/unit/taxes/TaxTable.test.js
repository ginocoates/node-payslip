import TaxTable from '../../../taxes/TaxTable';
import {messages} from '../../../resources';
let sandbox;

describe('TaxTable', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('apply', () => {
    it('should raise an error if the matching rule not found', ()=>{
      let salary = 10000;
      let tax = 50;

      let rule1 = {
        test: sandbox.spy(() => false),
        apply: sandbox.spy(() => tax)
      };

      let target = new TaxTable([rule1]);

      try{
        target.apply(salary);
        return expect.fail('Expected an exception');
      }catch(err){
        return expect(err.message).to.equal(messages.ruleNotFound);
      }
    });

    it('should test the maching rule', () => {
      let salary = 10000;
      let tax = 50;

      let rule1 = {
        test: sandbox.spy(() => true),
        apply: sandbox.spy(() => tax)
      };

      let rule2 = {
        test: sandbox.spy(() => false),
        apply: sandbox.spy()
      };

      let target = new TaxTable([rule1, rule2]);
      target.apply(salary);
      expect(rule1.test.calledOnce).to.be.true;
      return expect(rule2.test.called).to.be.false;
    });

    it('should apply the matching rule', () => {
      let salary = 10000;
      let tax = 50;

      let rule1 = {
        test: sandbox.spy(() => true),
        apply: sandbox.spy(() => tax)
      };

      let rule2 = {
        test: sandbox.spy(() => false),
        apply: sandbox.spy()
      };

      let target = new TaxTable([rule1, rule2]);
      let actual = target.apply(salary);
      expect(actual).to.equal(tax);
      expect(rule1.apply.calledWith(salary)).to.be.true;
      return expect(rule2.apply.called).to.be.false;
    });
  });
});
