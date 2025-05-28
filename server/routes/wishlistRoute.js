const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlistController");
const authentication = require("../middlewares/authentication");

router.use(authentication);

// Add to wishlist endpoint
router.post("/:carId", WishlistController.addToWishlist);

// Middleware for routes that need wishlist validation
router.use("/:userId/:carId", WishlistController.validateWishlistId);

module.exports = router;