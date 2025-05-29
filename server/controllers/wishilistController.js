const { WishlistItem, Car, Category } = require('../models');

class WishlistController {
  static async addToWishlist(req, res, next) {
    try {
      const UserId = req.user.id; // From authentication middleware
      const { CarId } = req.body;

      // Validate if car exists
      const car = await Car.findByPk(CarId);
      if (!car) {
        throw { status: 404, message: 'Car not found' };
      }

      // Check if item already in wishlist
      const existingItem = await WishlistItem.findOne({
        where: { UserId, CarId }
      });

      if (existingItem) {
        throw { status: 400, message: 'Car already in wishlist' };
      }

      // Create wishlist item
      const wishlistItem = await WishlistItem.create({
        UserId,
        CarId
      });

      // Get car details for response
      const carWithDetails = await Car.findOne({
        where: { id: CarId },
        include: [{ model: Category }]
      });

      res.status(201).json({
        message: 'Car added to wishlist successfully',
        wishlist: {
          id: wishlistItem.id,
          car: {
            id: carWithDetails.id,
            brand: carWithDetails.brand,
            type: carWithDetails.Type,
            category: carWithDetails.Category.name,
            price: carWithDetails.price,
            imageUrl: carWithDetails.imageUrl
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WishlistController;