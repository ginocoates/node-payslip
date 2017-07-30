import config from '../config';
import util from 'util';
import { messages, events } from '../resources';
import TaxTable from '../taxes';
import EventEmitter from 'events';

export default class PayrollService extends EventEmitter {
  process(taxYear, streamProvider){
    return new Promise((resolve, reject) => {

      if(!taxYear || taxYear === ''){
        taxYear = config.defaultRules;
      }

      if(!streamProvider || !streamProvider.initialized){
        return reject(new Error(util.format(`${messages.arguments}:streamProvider`)));
      }

      const taxTable = TaxTable[taxYear];

      if(!taxTable){
        return reject(new Error(messages.unknownTaxRules));
      }

      streamProvider.csvIn
        .on('error', err => reject(err));

      streamProvider.csvOut
        .transform(data => this.generatePayslip(data, taxTable))
        .on('finish', () => resolve())
        .on('error', err => reject(err));
    });
  }

  generatePayslip(data, taxTable){
    const gross = Math.round(data.annual_salary / 12);
    const tax = Math.round(taxTable.apply(data.annual_salary) / 12);
    const net = Math.round(gross - tax);
    const superAnnuation = Math.round(gross * data.super_rate);
    
    const payslip = {
      name: `${data.first_name} ${data.last_name}`,
      pay_period: data.payment_start_date,
      gross_income: gross,
      income_tax: tax,
      net_income: net,
      super_annuation: superAnnuation
    };

    this.emit(events.payslipReady, payslip);

    return payslip;
  }
}
