export default class TaxRule {
  constructor(bandLow, bandHigh, initial, rate){
    this.bandLow = bandLow;
    this.bandHigh = bandHigh;
    this.initial = initial;
    this.rate = rate;
  }
  test(salary){
    return salary >= this.bandLow
      && this.bandHigh === 0 || salary <= this.bandHigh;
  }
  apply(salary){
    return this.initial + ((salary - this.bandLow - 1) * this.rate);
  }
}
