'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      condition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fuel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      released_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      features: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      price: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Cars');
  }
};