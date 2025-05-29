const { Car, Category } = require("../models");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenAI,Type } = require("@google/genai");
const { generateContent } = require("../lib/gemini.api");
const GOOGLE_GEN_AI_API_KEY = process.env.GOOGLE_GEN_AI_API_KEY;
const ai = new GoogleGenAI({
  apiKey:GOOGLE_GEN_AI_API_KEY,
});
class AIController {
  

  static async getRecommendation(req, res, next) {
    try {
      const { budget, preferences } = req.body;
      
      // Validate budget parameter
      if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
        return res.status(400).json({
          error: "Budget harus berupa angka yang valid dan lebih besar dari 0"
        });
      }
      
      const validBudget = Number(budget);
      
      // Build query based on budget and preferences
      const query = {
        price: { [Op.lte]: validBudget },
      };

      // Add brand filter if provided
      if (preferences && preferences.brand) {
        query.brand = { [Op.iLike]: `%${preferences.brand}%` };
      }

      // Add category filter if provided
      if (preferences && preferences.category) {
        const category = await Category.findOne({
          where: { name: { [Op.iLike]: `%${preferences.category}%` } },
        });

        if (category) {
          query.CategoryId = category.id;
        }
      }

      // Add fuel type filter if provided
      if (preferences && preferences.fuel) {
        query.fuel = { [Op.iLike]: `%${preferences.fuel}%` };
      }

      // Find cars matching criteria first
      const cars = await Car.findAll({
        where: query,
        include: [{ model: Category }],
        order: [["price", "DESC"]],
      });
      
      // If no cars found, return early with a message
      if (cars.length === 0) {
        return res.json({
          message: "Maaf, tidak ada kendaraan yang sesuai dengan kriteria Anda.",
          recommendations: []
        });
      }
      
      // Map cars to format needed for AI prompt
      const dataCars = cars.map(car => ({
        id: car.id,
        type: car.Type,
        price: car.price,
        brand: car.brand
      }));
      
      const prompt = `I want you to recommend the user with top 3 cars
      from the list below:
      ${dataCars.map((car) => `- ${car.brand} ${car.type} (ID: ${car.id}, Price: Rp ${car.price.toLocaleString("id-ID")})`).join("\n")}
      based on the following criteria:
      - Budget: Rp ${validBudget.toLocaleString("id-ID")}
      - Preferences: ${JSON.stringify(preferences)}
      Response with Array of ID`;
      
      console.log("Cars available for recommendation:", dataCars);
      console.log("Prompt sent to AI:", prompt);
      
      // Get AI recommendations
      const generate = await generateContent(prompt);
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(generate);
        console.log("Parsed Output:", parsedOutput);
      } catch (error) {
        console.error("Error parsing AI response:", error);
        // Fallback: use top 3 cars if AI response can't be parsed
        parsedOutput = dataCars.slice(0, 3).map(car => car.id);
        console.log("Using fallback car IDs:", parsedOutput);
      }
      
      // If AI returned empty array, use fallback
      if (!parsedOutput || !parsedOutput.length) {
        parsedOutput = dataCars.slice(0, 3).map(car => car.id);
        console.log("AI returned empty array, using fallback:", parsedOutput);
      }

      const findCars = await Car.findAll({
        where: {
          id: { [Op.in]: parsedOutput },
        },
        include: [{ model: Category }],
      });
      
      // Send the response with recommendations
      res.json({
        message: `Berdasarkan budget Anda sebesar Rp ${validBudget.toLocaleString("id-ID")} dan preferensi yang diberikan, berikut adalah ${findCars.length} rekomendasi kendaraan terbaik untuk Anda:`,
        recommendations: findCars.map((car) => ({
          id: car.id,
          brand: car.brand,
          type: car.Type,
          reasoning: `${car.brand} ${car.Type} adalah pilihan yang bagus karena sesuai dengan budget Anda${car.features ? ` dan memiliki fitur-fitur seperti ${Array.isArray(car.features) ? car.features.join(", ") + (car.features.length > 3 ? ", dan lainnya" : "") : ""}` : "."}`,
        })),
      });
    } catch (err) {
      console.error("Error in getRecommendation:", err);
      next(err);
    }
  }
}

module.exports = AIController;
