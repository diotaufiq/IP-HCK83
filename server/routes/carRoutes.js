const express = require('express');
const router = express.Router();
const CarController = require('../controllers/carController');
const authentication = require('../middlewares/authentication');
const { isAdmin } = require('../middlewares/authorization');
const multer = require('multer')
const upload = multer({
    storage:multer.memoryStorage()
})

// Public routes
router.get('/', CarController.getAllCars);
router.get('/:carId', CarController.getCarById);

// Protected routes (admin only)
router.use(authentication);
router.use(isAdmin);
router.post('/', CarController.createCar);
router.put('/:carId', CarController.updateCar);
router.delete('/:carId', CarController.deleteCar)
router.patch('/:carId',upload.single('image'),CarController.UploadImage);

module.exports = router;