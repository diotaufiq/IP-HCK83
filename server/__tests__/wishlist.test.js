const request = require('supertest');
const app = require('../app');
const { User, Car, Category, WishlistItem } = require('../models');
const { generateToken } = require('../helpers/jwt');

let userToken;
let testUserId;
let testCarId;
let testCategoryId;

beforeAll(async () => {
  try {
    // Create test user
    const user = await User.create({
      username: 'wishlistUser',
      email: 'wishlistuser@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    testUserId = user.id;
    userToken = generateToken({
      id: user.id,
      email: user.email
    });
    
    // Create test category
    const category = await Category.create({
      name: 'Wishlist Test Category'
    });
    
    testCategoryId = category.id;
    
    // Create test car
    const car = await Car.create({
      brand: 'Wishlist Test Brand',
      type: 'Wishlist Test Type',
      released_year: 2023,
      condition: 'New',
      fuel: 'Gasoline',
      features: 'Wishlist Test Features',
      price: 45000,
      imageUrl: 'https://example.com/wishlist-image.jpg',
      CategoryId: testCategoryId,
      UserId: testUserId
    });
    
    testCarId = car.id;
  } catch (error) {
    console.error('Setup error:', error);
  }
});

afterAll(async () => {
  try {
    // Clean up test data
    await WishlistItem.destroy({ where: { UserId: testUserId } });
    await Car.destroy({ where: { id: testCarId } });
    await Category.destroy({ where: { id: testCategoryId } });
    await User.destroy({ where: { id: testUserId } });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

describe('Wishlist Routes', () => {
  describe('POST /wishlists/:carId', () => {
    it('should add a car to wishlist with status 201 when authenticated', async () => {
      const res = await request(app)
        .post(`/wishlists/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).post(`/wishlists/${testCarId}`);
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .post('/wishlists/9999')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(404);
    });
    
    it('should return 400 if car is already in wishlist', async () => {
      // First add the car to wishlist
      await request(app)
        .post(`/wishlists/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      // Try to add it again
      const res = await request(app)
        .post(`/wishlists/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(400);
    });
  });
});