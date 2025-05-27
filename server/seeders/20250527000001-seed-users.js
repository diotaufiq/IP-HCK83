'use strict';
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const userData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/user.json'), 'utf8'));
    const users = userData.map(user => {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      
      return {
        ...user,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};