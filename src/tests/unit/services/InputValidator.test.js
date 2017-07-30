import { InputValidator } from '../../../services';
import { RowFixture } from '../../fixtures';

describe('InputValidator', () => {
  describe('stream validation', () => {
    it('should return false when salary < 0', () => {
      let data = RowFixture.new({
        annual_salary: -1
      });

      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when missing salary', () => {
      let data = RowFixture.new();
      delete data.annual_salary;
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when string salary', () => {
      let data = RowFixture.new({ annual_salary: 'invalid'});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when firstname null', () => {
      let data = RowFixture.new({ first_name: null});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when firstname empty', () => {
      let data = RowFixture.new({ first_name: ''});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when firstname missing', () => {
      let data = RowFixture.new();
      delete data.first_name;
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when lastname null', () => {
      let data = RowFixture.new({ last_name: null});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when lastname missing', () => {
      let data = RowFixture.new();
      delete data.last_name;
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when lastname empty', () => {
      let data = RowFixture.new({ last_name: ''});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when super rate null', () => {
      let data = RowFixture.new({ super_rate: null});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when negative super rate', () => {
      let data = RowFixture.new({ super_rate: -1});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when super rate > 50%', () => {
      let data = RowFixture.new({ super_rate: .6});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when payment date empty', () => {
      let data = RowFixture.new({ payment_start_date: ''});
      return expect(InputValidator.validate(data)).to.be.false;
    });

    it('should return false when payment date missing', () => {
      let data = RowFixture.new();
      delete data.payment_start_date;
      return expect(InputValidator.validate(data)).to.be.false;
    });
  });
});
