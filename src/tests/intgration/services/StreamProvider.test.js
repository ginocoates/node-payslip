import { StreamProvider } from '../../../services';

let sandbox;
let target;
let inputFile;
let outputFile;

describe('StreamProvider', () => {
  before(() => {
    sandbox = sinon.sandbox.create();
    target = new StreamProvider();
    inputFile = `${__dirname}/../../testdata/input.csv`;
    outputFile = `${__dirname}/../../testdata/output.csv`;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should resolve with stream provider', () => {
    return expect(target.initialize(inputFile, outputFile))
      .to.eventually.be.fulfilled
      .then(provider => expect(provider === target).to.be.true);
  });

  describe('IO', () => {
    it('should reject with error opening input file', () => {
      return expect(target.initialize('', outputFile))
        .to.eventually.be.rejected;
    });

    it('should reject with error opening output file', () => {
      return expect(target.initialize(inputFile, ''))
        .to.eventually.be.rejected;
    });
  });
});
