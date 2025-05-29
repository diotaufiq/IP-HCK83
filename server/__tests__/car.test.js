const request = require('supertest');
const app = require('../app');
const { User, Car, Category } = require('../models');
const { generateToken } = require('../helpers/jwt');

let adminToken;
let userToken;
let testCategoryId;
let testCarId;

beforeAll(async () => {
  try {
    // Create test admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    adminToken = generateToken({
      id: admin.id,
      email: admin.email
    });
    
    // Create test regular user
    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    userToken = generateToken({
      id: user.id,
      email: user.email
    });
    
    // Create test category
    const category = await Category.create({
      name: 'Test Category'
    });
    
    testCategoryId = category.id;
    
    // Create test car
    const car = await Car.create({
      brand: 'Test Brand',
      type: 'Test Type',
      released_year: 2023,
      condition: 'New',
      fuel: 'Gasoline',
      features: 'Test Features',
      price: 50000,
      imageUrl: 'https://example.com/image.jpg',
      CategoryId: testCategoryId,
      UserId: admin.id
    });
    
    testCarId = car.id;
  } catch (error) {
    console.error('Setup error:', error);
  }
});

afterAll(async () => {
  try {
    // Clean up test data
    await Car.destroy({ where: { id: testCarId } });
    await Category.destroy({ where: { id: testCategoryId } });
    await User.destroy({ where: { email: 'admin@example.com' } });
    await User.destroy({ where: { email: 'user@example.com' } });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

describe('Car Routes', () => {
  describe('GET /cars', () => {
    it('should return all cars with status 200', async () => {
      const res = await request(app).get('/cars');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
  
  describe('GET /cars/:carId', () => {
    it('should return a specific car with status 200', async () => {
      const res = await request(app).get(`/cars/${testCarId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', testCarId);
      expect(res.body).toHaveProperty('brand', 'Test Brand');
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app).get('/cars/9999');
      
      expect(res.statusCode).toBe(404);
    });
  });
  
  // Tambahkan test untuk missing required fields
  describe('POST /cars', () => {
    it('should create a new car with status 201 when admin is authenticated', async () => {
      const res = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'New Brand',
          type: 'New Type',
          released_year: 2024,
          condition: 'New',
          fuel: 'Electric',
          features: 'New Features',
          price: 60000,
          imageUrl: 'https://example.com/new-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('brand', 'New Brand');
      
      // Clean up
      await Car.destroy({ where: { brand: 'New Brand' } });
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/cars')
        .send({
          brand: 'Unauthorized Brand',
          type: 'Unauthorized Type',
          released_year: 2024,
          condition: 'New',
          fuel: 'Electric',
          features: 'Unauthorized Features',
          price: 60000,
          imageUrl: 'https://example.com/unauthorized-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          brand: 'Forbidden Brand',
          type: 'Forbidden Type',
          released_year: 2024,
          condition: 'New',
          fuel: 'Electric',
          features: 'Forbidden Features',
          price: 60000,
          imageUrl: 'https://example.com/forbidden-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'Incomplete Brand'
          // Missing required fields
        });
      
      expect(res.statusCode).toBe(400);
    });
  });
  
  describe('PUT /cars/:carId', () => {
    it('should update a car with status 200 when admin is authenticated', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'Updated Brand',
          type: 'Updated Type',
          released_year: 2025,
          condition: 'Used',
          fuel: 'Hybrid',
          features: 'Updated Features',
          price: 55000,
          imageUrl: 'https://example.com/updated-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', testCarId);
      expect(res.body).toHaveProperty('brand', 'Updated Brand');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .send({
          brand: 'Unauthorized Update',
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          brand: 'Forbidden Update',
        });
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .put('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'Nonexistent Update',
        });
      
      expect(res.statusCode).toBe(404);
    });
  });
  
  describe('DELETE /cars/:carId', () => {
    it('should delete a car with status 200 when admin is authenticated', async () => {
      // First create a car to delete
      const car = await Car.create({
        brand: 'Delete Brand',
        type: 'Delete Type',
        released_year: 2023,
        condition: 'New',
        fuel: 'Gasoline',
        features: 'Delete Features',
        price: 40000,
        imageUrl: 'https://example.com/delete-image.jpg',
        CategoryId: testCategoryId,
        UserId: 1
      });
      
      const res = await request(app)
        .delete(`/cars/${car.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).delete(`/cars/${testCarId}`);
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .delete(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .delete('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(404);
    });
  });
});