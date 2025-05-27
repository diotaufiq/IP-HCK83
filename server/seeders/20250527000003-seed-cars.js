'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming your data.json contains the car data where 'features' is an array of strings
    const carData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json'), 'utf8'));
    const cars = carData.map(car => {
      // Ensure car.features is an array of strings as per your last data generation
      // If it's already an array of strings, we need to stringify it for JSONB
      let processedFeatures;
      if (Array.isArray(car.features)) {
        processedFeatures = JSON.stringify(car.features); // Stringify the array
      } else {
        // Fallback or error handling if features is not an array
        // For now, let's assume it's always an array based on your data
        processedFeatures = JSON.stringify([]); 
      }
      
      return {
        ...car, // Spread the rest of the car properties
        features: processedFeatures, // Assign the stringified JSON
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    await queryInterface.bulkInsert('Cars', cars, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};