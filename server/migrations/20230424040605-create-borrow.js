'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
          model: "accounts",
          key: "account_id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "books",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      returned: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrows');
  }
};