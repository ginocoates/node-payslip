module.exports = {
  validate: function(data){
    return data.annual_salary !== undefined
      && data.annual_salary !== null
      && data.annual_salary > 0
      && data.first_name !== undefined
      && data.first_name !== null
      && data.first_name.length > 0
      && data.last_name !== undefined
      && data.last_name !== null
      && data.last_name.length > 0
      && data.super_rate !== undefined
      && data.super_rate !== null
      && data.super_rate >= 0
      && data.super_rate <= 0.5
      && data.payment_start_date !== undefined
      && data.payment_start_date !== null
      && data.payment_start_date.length > 0;
  }
};
