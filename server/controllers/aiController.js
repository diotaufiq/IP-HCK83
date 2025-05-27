const { Car, Category } = require('../models');
const { Op } = require('sequelize');

class AIController {
  static async getRecommendation(req, res, next) {
    try {
      const { budget, preferences } = req.body;
      
      if (!budget) {
        throw { status: 400, message: 'Budget is required' };
      }
      
      // Parse budget to number
      const budgetNum = Number(budget);
      if (isNaN(budgetNum)) {
        throw { status: 400, message: 'Budget must be a number' };
      }
      
      // Build query based on budget and preferences
      const query = {
        price: { [Op.lte]: budgetNum }
      };
      
      // Add category filter if provided
      if (preferences && preferences.category) {
        const category = await Category.findOne({ 
          where: { name: { [Op.iLike]: `%${preferences.category}%` } } 
        });
        
        if (category) {
          query.CategoryId = category.id;
        }
      }
      
      // Add brand filter if provided
      if (preferences && preferences.brand) {
        query.brand = { [Op.iLike]: `%${preferences.brand}%` };
      }
      
      // Add fuel type filter if provided
      if (preferences && preferences.fuel) {
        query.fuel = { [Op.iLike]: `%${preferences.fuel}%` };
      }
      
      // Find cars matching criteria
      const cars = await Car.findAll({
        where: query,
        include: [{ model: Category }],
        order: [['price', 'DESC']],
        limit: 5
      });
      
      // Generate AI-like response
      let response;
      
      if (cars.length === 0) {
        response = {
          message: "Maaf, saya tidak menemukan kendaraan yang sesuai dengan budget dan preferensi Anda. Mungkin Anda ingin menaikkan budget atau mengubah preferensi Anda?",
          recommendations: []
        };
      } else {
        response = {
          message: `Berdasarkan budget Anda sebesar Rp ${budgetNum.toLocaleString('id-ID')} dan preferensi yang diberikan, berikut adalah ${cars.length} rekomendasi kendaraan terbaik untuk Anda:`,
          recommendations: cars.map(car => ({
            id: car.id,
            brand: car.brand,
            type: car.Type,
            category: car.Category.name,
            fuel: car.fuel,
            features: car.features,
            price: car.price,
            imageUrl: car.imageUrl,
            reasoning: `${car.brand} ${car.Type} adalah pilihan yang bagus karena sesuai dengan budget Anda dan memiliki fitur-fitur seperti ${car.features.slice(0, 3).join(', ')}${car.features.length > 3 ? ', dan lainnya' : ''}.`
          }))
        };
      }
      
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AIController;