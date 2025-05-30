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
    // Ganti 'type' menjadi 'Type'
    const car = await Car.create({
      brand: 'Wishlist Test Brand',
      Type: 'Wishlist Test Type', // Ubah dari 'type' ke 'Type'
      // Ubah dari number ke string
      released_year: "2023", // Ubah dari 2023 ke "2023"
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
      // Enhanced assertions
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.toLowerCase()).toContain('added');
      expect(res.body.message.toLowerCase()).toContain('wishlist');
      
      // Verify the wishlist item was actually created in the database
      const wishlistItem = await WishlistItem.findOne({
        where: {
          UserId: testUserId,
          CarId: testCarId
        }
      });
      expect(wishlistItem).not.toBeNull();
      expect(wishlistItem.UserId).toBe(testUserId);
      expect(wishlistItem.CarId).toBe(testCarId);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).post(`/wishlists/${testCarId}`);
      
      expect(res.statusCode).toBe(401);
      // Enhanced assertions
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      // Ubah assertion ini:
      expect(res.body.message.toLowerCase()).toContain('unauthorized');
      // Menjadi:
      expect(res.body.message.toLowerCase()).toContain('login');
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .post('/wishlists/9999')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(404);
      // Enhanced assertions
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.toLowerCase()).toContain('not found');
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
      // Enhanced assertions
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.toLowerCase()).toContain('already');
      expect(res.body.message.toLowerCase()).toContain('wishlist');
    });
  });
  
  // Add new test for GET /wishlists
  describe('GET /wishlists', () => {
    it('should return user\'s wishlist items with status 200 when authenticated', async () => {
      const res = await request(app)
        .get('/wishlists')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('UserId', testUserId);
      expect(res.body[0]).toHaveProperty('CarId', testCarId);
      expect(res.body[0]).toHaveProperty('Car');
      expect(res.body[0].Car).toHaveProperty('brand', 'Wishlist Test Brand');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/wishlists');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
  
  // Add new test for DELETE /wishlists/:carId
  describe('DELETE /wishlists/:carId', () => {
    it('should remove a car from wishlist with status 200 when authenticated', async () => {
      const res = await request(app)
        .delete(`/wishlists/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.toLowerCase()).toContain('removed');
      
      // Verify the wishlist item was actually deleted from the database
      const wishlistItem = await WishlistItem.findOne({
        where: {
          UserId: testUserId,
          CarId: testCarId
        }
      });
      expect(wishlistItem).toBeNull();
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).delete(`/wishlists/${testCarId}`);
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 404 if wishlist item does not exist', async () => {
      const res = await request(app)
        .delete(`/wishlists/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message.toLowerCase()).toContain('not found');
    });
  });
});