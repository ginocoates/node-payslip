import {messages} from '../resources';
export default class TaxRule {
  constructor(bandLow, bandHigh, initial, rate){
    this.bandLow = bandLow;
    this.bandHigh = bandHigh;
    this.initial = initial;
    this.rate = rate;
  }
  test(salary){
    if(!salary || salary < 0) return false;

    return salary >= this.bandLow
      && (this.bandHigh === 0 || salary <= this.bandHigh);
  }
  apply(salary){
    if(!salary || salary < 0)
    {
      throw new Error(messages.invalidSalary);
    }
    return this.initial + ((salary - this.bandLow - 1) * this.rate);
  }
}
