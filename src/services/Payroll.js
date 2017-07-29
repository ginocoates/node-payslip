import { messages } from '../resources';
import util from 'util';
import csv from 'fast-csv';
import fs from 'fs';
import InputValidator from './InputValidator';
import { Console } from '../utils';
import TaxTable from '../taxes';
import config from '../config';

export default class PayrollService {
  process(inputFile, outputFile, taxYear){
    return new Promise((resolve, reject) => {
      if(!inputFile || inputFile === ''){
        return reject(new Error(util.format(messages.arguments, 'inputFile')));
      }

      if(!outputFile || outputFile === ''){
        return reject(new Error(util.format(messages.arguments, 'outputFile')));
      }

      if(!taxYear || taxYear === ''){
        taxYear = config.defaultRules;
      }

      const taxTable = TaxTable[taxYear];

      if(!taxTable){
        return reject(new Error(util.format(messages.unknownTaxRules, taxYear)));
      }

      fs.open(inputFile,'r',(err, fd) =>{
        if(err) {
          return reject(err);
        }

        // stream, validate and transform data, generating payslip on the way
        csv.fromStream(fs.createReadStream('', {fd: fd, autoClose: true}), {headers: true, trim: true})
          .validate(InputValidator)
          .on('error', err => reject(err))
          .on('data-invalid', data => Console.error(util.format('%s:%s', messages.invalidInputRow, JSON.stringify(data))))
          .pipe(csv.createWriteStream({headers: true, trim: true}))
          .transform(data => this.generatePayslip(data, taxTable))
          .pipe(fs.createWriteStream(outputFile, {encoding: 'utf8'}))
          .on('finish', () => resolve())
          .on('error', err => reject(err));
      });
    });
  }

  generatePayslip(data, taxTable){
    const gross = Math.round(data.annual_salary / 12);
    const tax = Math.round(taxTable.apply(data.annual_salary) / 12);
    const net = Math.round(gross - tax);

    const payslip = {
      name: `${data.first_name} ${data.last_name}`,
      pay_period: data.payment_start_date,
      gross_income: gross,
      income_tax: tax,
      net_income: net,
      super_annuation: Math.round(gross * data.super_rate)
    };

    Console.success(`${payslip.name}, ${payslip.pay_period},${payslip.gross_income},${payslip.income_tax},${payslip.net_income},${payslip.super_annuation}`);

    return payslip;
  }
}
