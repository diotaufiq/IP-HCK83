const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const authentication = require('../middlewares/authentication');
const { isAdmin } = require('../middlewares/authorization');

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

// Protected routes (admin only)
router.use(authentication);
router.use(isAdmin);
router.post('/', CategoryController.createCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;