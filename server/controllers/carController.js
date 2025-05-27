// const { message } = require('statuses');
const { Car, Category, User } = require('../models');
const { v2: cloudinary} = require('cloudinary')
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


class CarController {
  static async getAllCars(req, res, next) {
    try {
      const cars = await Car.findAll({
        include: [
          { model: Category },
          { model: User, attributes: ['username', 'email'] }
        ]
      });
      
      res.status(200).json(cars);
    } catch (err) {
      next(err);
    }
  }
  
  static async getCarById(req, res, next) {
    try {
      const { id } = req.params;
      
      const car = await Car.findByPk(id, {
        include: [
          { model: Category },
          { model: User, attributes: ['username', 'email'] }
        ]
      });
      
      if (!car) {
        throw { status: 404, message: 'Car not found' };
      }
      
      res.status(200).json(car);
    } catch (err) {
      next(err);
    }
  }
  
  static async createCar(req, res, next) {
    try {
      const { brand, Type, fuel, features, price, imageUrl, CategoryId } = req.body;
      
      const car = await Car.create({
        UserId: req.user.id,
        brand,
        Type,
        fuel,
        features,
        price,
        imageUrl,
        CategoryId
      });
      
      res.status(201).json(car);
    } catch (err) {
      next(err);
    }
  }
  
  static async updateCar(req, res, next) {
    try {
      const { id } = req.params;
      const { brand, Type, fuel, features, price, imageUrl, CategoryId } = req.body;
      
      const car = await Car.findByPk(id);
      if (!car) {
        throw { status: 404, message: 'Car not found' };
      }
      
      await Car.update({
        brand,
        Type,
        fuel,
        features,
        price,
        imageUrl,
        CategoryId
      }, {
        where: { id }
      });
      
      res.status(200).json({ message: 'Car updated successfully' });
    } catch (err) {
      next(err);
    }
  }
  
  static async deleteCar(req, res, next) {
    try {
      const { id } = req.params;
      
      const car = await Car.findByPk(id);
      if (!car) {
        throw { status: 404, message: 'Car not found' };
      }
      
      await Car.destroy({ where: { id } });
      
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
  static async UploadImage(req, res, next) {
    try {
      const { id } = req.params;
      if (!req.file) {
        throw { status: 400, message: 'No image file uploaded' };
      }
      const base64file = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64file}`;
  
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'hck-83-phase2',
        public_id: req.file.originalName // Pertimbangkan keunikan public_id
      });
  
      const car = await Car.findByPk(id);
      if (!car) {
        throw { status: 404, message: 'Car not found' };
      }
  
      car.imageUrl = uploadResult.secure_url; // Ubah atribut pada instance
      await car.save();                       // Simpan perubahan pada instance tersebut
  
      res.status(200).json({
        message: "Image has been updated successfully",
        // imageUrl: car.imageUrl
      });
  
    } catch (err) {
      if (err.http_code && err.message) { 
          return next({ status: err.http_code, message: `Cloudinary error: ${err.message}` });
      }
      next(err);
    }
  }
}

module.exports = CarController;