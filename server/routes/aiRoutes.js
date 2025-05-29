const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const authentication = require('../middlewares/authentication');

// Protected routes (user must be logged in)
router.use(authentication);
// Add this route to your existing AI routes
router.post('/recommend', AIController.getRecommendation);

module.exports = router;