import { messages } from '../resources';

export default class TaxTable {
  constructor(rules){
    this.rules = rules;
  }

  apply(salary){
    const rule = this.rules.find(r => r.test(salary));

    if(!rule) {
      throw new Error(messages.ruleNotFound);
    }

    return rule.apply(salary);
  }
}
