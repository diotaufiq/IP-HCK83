const { Category } = require('../models');

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }
  
  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      if (!category) {
        throw { status: 404, message: 'Category not found' };
      }
      
      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }
  
  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      
      const category = await Category.create({ name });
      
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
  
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const category = await Category.findByPk(id);
      if (!category) {
        throw { status: 404, message: 'Category not found' };
      }
      
      await Category.update({ name }, { where: { id } });
      
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
      next(err);
    }
  }
  
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      if (!category) {
        throw { status: 404, message: 'Category not found' };
      }
      
      await Category.destroy({ where: { id } });
      
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;