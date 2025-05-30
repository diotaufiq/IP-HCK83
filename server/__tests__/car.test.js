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
    
    // Tambahkan role ke token generation
    adminToken = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role // Tambahkan ini
    });
    
    userToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role // Tambahkan ini
    });
    
    // Create test category
    const category = await Category.create({
      name: 'Test Category'
    });
    
    testCategoryId = category.id;
    
    // Create test car - using Type (capital T) to match model
    const car = await Car.create({
      brand: 'Test Brand',
      Type: 'Test Type', // Changed from 'type' to 'Type'
      released_year: "2023",
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
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('brand');
      expect(res.body[0]).toHaveProperty('Type'); 
      expect(res.body[0]).toHaveProperty('price');
      expect(res.body[0]).toHaveProperty('imageUrl');
      expect(res.body[0]).toHaveProperty('CategoryId');
      expect(res.body[0]).toHaveProperty('Category');
      expect(typeof res.body[0].id).toBe('number');
      expect(typeof res.body[0].brand).toBe('string');
      expect(typeof res.body[0].Type).toBe('string');
    });
  });
  
  describe('GET /cars/:carId', () => {
    it('should return a specific car with status 200', async () => {
      const res = await request(app).get(`/cars/${testCarId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', testCarId);
      expect(res.body).toHaveProperty('brand', 'Test Brand');
      expect(res.body).toHaveProperty('Type', 'Test Type'); 
      expect(res.body).toHaveProperty('released_year', "2023");
      expect(res.body).toHaveProperty('condition', 'New');
      expect(res.body).toHaveProperty('fuel', 'Gasoline');
      expect(res.body).toHaveProperty('features', 'Test Features');
      expect(res.body).toHaveProperty('price', 50000);
      expect(res.body).toHaveProperty('imageUrl', 'https://example.com/image.jpg');
      expect(res.body).toHaveProperty('CategoryId', testCategoryId);
      expect(res.body).toHaveProperty('Category');
      expect(res.body.Category).toBeInstanceOf(Object);
      expect(res.body.Category).toHaveProperty('name', 'Test Category');
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app).get('/cars/9999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
  
  describe('POST /cars', () => {
    it('should create a new car with status 201 when admin is authenticated', async () => {
      const res = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'New Brand',
          Type: 'New Type', 
          released_year: "2024",
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
      expect(res.body).toHaveProperty('Type', 'New Type'); // Changed from 'type' to 'Type'
      expect(res.body).toHaveProperty('released_year', "2024");
      expect(res.body).toHaveProperty('condition', 'New');
      expect(res.body).toHaveProperty('fuel', 'Electric');
      expect(res.body).toHaveProperty('features', 'New Features');
      expect(res.body).toHaveProperty('price', 60000);
      expect(res.body).toHaveProperty('imageUrl', 'https://example.com/new-image.jpg');
      expect(res.body).toHaveProperty('CategoryId', testCategoryId);
      expect(res.body).toHaveProperty('UserId');
      expect(typeof res.body.id).toBe('number');
      
      // Clean up
      await Car.destroy({ where: { brand: 'New Brand' } });
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/cars')
        .send({
          brand: 'Unauthorized Brand',
          Type: 'Unauthorized Type',
          released_year: "2024",
          condition: 'New',
          fuel: 'Electric',
          features: 'Unauthorized Features',
          price: 60000,
          imageUrl: 'https://example.com/unauthorized-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          brand: 'Forbidden Brand',
          Type: 'Forbidden Type',
          released_year: "2024",
          condition: 'New',
          fuel: 'Electric',
          features: 'Forbidden Features',
          price: 60000,
          imageUrl: 'https://example.com/forbidden-image.jpg',
          CategoryId: testCategoryId
        });
      
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
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
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
  
  describe('PUT /cars/:carId', () => {
    it('should update a car with status 200 when admin is authenticated', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'Updated Brand',
          Type: 'Updated Type', // Changed from 'type' to 'Type'
          released_year: "2025",
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
      expect(res.body).toHaveProperty('Type', 'Updated Type'); // Changed from 'type' to 'Type'
      expect(res.body).toHaveProperty('released_year', "2025");
      expect(res.body).toHaveProperty('condition', 'Used');
      expect(res.body).toHaveProperty('fuel', 'Hybrid');
      expect(res.body).toHaveProperty('features', 'Updated Features');
      expect(res.body).toHaveProperty('price', 55000);
      expect(res.body).toHaveProperty('imageUrl', 'https://example.com/updated-image.jpg');
      expect(res.body).toHaveProperty('CategoryId', testCategoryId);
      expect(res.body).toHaveProperty('updatedAt');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .send({
          brand: 'Unauthorized Update',
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .put(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          brand: 'Forbidden Update',
        });
      
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .put('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          brand: 'Nonexistent Update',
        });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
  
  describe('DELETE /cars/:carId', () => {
    it('should delete a car with status 200 when admin is authenticated', async () => {
      // First create a car to delete
      const car = await Car.create({
        brand: 'Delete Brand',
        Type: 'Delete Type', // Changed from 'type' to 'Type'
        released_year: "2023",
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
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).delete(`/cars/${testCarId}`);
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .delete(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
    
    it('should return 404 if car does not exist', async () => {
      const res = await request(app)
        .delete('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
});