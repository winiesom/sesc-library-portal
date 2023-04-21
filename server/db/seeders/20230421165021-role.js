'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', [{
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
     }], {});

     await queryInterface.bulkInsert('role', [{
      role: 'student',
      created_at: new Date(),
      updated_at: new Date()
     }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
};
