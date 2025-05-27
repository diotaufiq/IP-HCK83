'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up (queryInterface, Sequelize) {
    const categoryData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/category.json'), 'utf8'));
    const categories = categoryData.map(category => {
      return {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};