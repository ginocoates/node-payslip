import TaxTable from './TaxTable';
import TaxRule from './TaxRule';

module.exports = {
  '2012-13': new TaxTable([
    new TaxRule(0, 18200, 0, 0),
    new TaxRule(18201, 37000, 0, .19),
    new TaxRule(37001, 80000, 3572, .325),
    new TaxRule(80000, 180000, 17547, .37),
    new TaxRule(180001, 0,54547, 0.45),
  ])
};
