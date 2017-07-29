import { Payroll } from './services';
import { Console } from './utils';

const printUsage = () => {
  Console.info('\nUsage:');
  Console.info('node index.js inputFile outputFile [taxYear]\n');
  Console.info('inputFile   - The input csv file');
  Console.info('outputFile  - The output payroll file');
  Console.info('taxYear     - The tax rules to use (optional - defaults to 2012-13)\n');
};

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const taxRules = process.argv[4];

new Payroll().process(inputFile, outputFile, taxRules)
  .then(() => {
    Console.success('Complete!');
  })
  .catch(err => {
    Console.error(err.toString());
    printUsage();
  });
