import { PayrollService, StreamProvider } from './services';
import { Console } from './utils';
import {messages, events } from './resources';
import util from 'util';

const printUsage = () => {
  Console.info('\nUsage:');
  Console.info('node index.js inputFile outputFile [taxYear]\n');
  Console.info('inputFile   - The input csv file');
  Console.info('outputFile  - The output payroll file');
  Console.info('taxYear     - The tax rules to use (optional - defaults to 2012-13)\n');
};

if(process.argv.length < 4){
  printUsage();
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const taxYear = process.argv[4];

new StreamProvider()
  .on(events.invalidRow, data => Console.error(util.format('%s:%s', messages.invalidInputRow, JSON.stringify(data))))
  .initialize(inputFile, outputFile)
  .then(streamProvider => new PayrollService()
    .on(events.payslipReady, payslip => Console.success(`${payslip.name}, ${payslip.pay_period},${payslip.gross_income},${payslip.income_tax},${payslip.net_income},${payslip.super_annuation}`))
    .process(taxYear, streamProvider))
  .then(() => Console.success('Complete!'))
  .catch(err => {
    Console.error(err.toString());
    printUsage();
  });
