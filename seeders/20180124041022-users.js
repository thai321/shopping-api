"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    // return queryInterface.bulkInsert(
    // 'users',
    // [
    // {
    //   name: 'thai',
    //   email: 'thai@gmail.com',
    //   password: 'password',
    //   phone: '4086085237',
    //   mailingAddress: 'Sunnyvale',
    //   shippingAdress: 'Sunnyvale',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }
    // ],
    // {}
    // );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
