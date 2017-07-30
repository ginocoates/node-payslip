/*eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
import { Console } from '../../../utils';

let sandbox;

describe('Console', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('output', () => {
    it('should call console.warn', () => {
      sandbox.stub(console, 'warn');
      Console.warn('');
      return expect(console.warn.calledOnce).to.be.true;
    });

    it('should call console.error', () => {
      sandbox.stub(console, 'error');
      Console.error('');
      return expect(console.error.calledOnce).to.be.true;
    });

    it('should call console.info', () => {
      sandbox.stub(console, 'info');
      Console.info('');
      return expect(console.info.calledOnce).to.be.true;
    });


    it('should call console.info for success', () => {
      sandbox.stub(console, 'info');
      Console.success('');
      return expect(console.info.calledOnce).to.be.true;
    });
  });
});
