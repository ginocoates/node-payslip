import faker from 'faker';

module.exports = {
  new(payload){
    return Object.assign({},{
      first_name: faker.name.firstName,
      last_name: faker.name.lastName,
      annual_salary: faker.random.number(180000),
      super_rate: faker.random.number(0,1, 0.01),
      payment_start_date: '01 March - 31 March'
    },payload);
  }
};
