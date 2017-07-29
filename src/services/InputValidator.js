module.exports = function validate(data){
  return data.annual_salary
  && data.annual_salary > 0
  && data.first_name
  && data.first_name.length > 0
  && data.last_name
  && data.last_name.length > 0
  && data.super_rate
  && data.super_rate >= 0
  && data.super_rate <= 0.5
  && data.payment_start_date
  && data.payment_start_date.length > 0;
};
