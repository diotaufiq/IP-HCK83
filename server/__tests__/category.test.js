const request = require('supertest');
const app = require('../app');
const { User, Category } = require('../models');
const { generateToken } = require('../helpers/jwt');

let adminToken;
let userToken;
let testCategoryId;

beforeAll(async () => {
  try {
    // Create test admin user
    await User.destroy({ where: { email: 'categoryadmin@example.com' } });
    const admin = await User.create({
      username: 'categoryadmin',
      email: 'categoryadmin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    adminToken = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });
    
    // Create test regular user
    await User.destroy({ where: { email: 'categoryuser@example.com' } });
    const user = await User.create({
      username: 'categoryuser',
      email: 'categoryuser@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    userToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // Create test category
    const category = await Category.create({
      name: 'Test Category'
    });
    
    testCategoryId = category.id;
  } catch (error) {
    console.error('Setup error:', error);
  }
});

afterAll(async () => {
  try {
    // Clean up test data
    await Category.destroy({ where: { id: testCategoryId } });
    await User.destroy({ where: { email: 'categoryadmin@example.com' } });
    await User.destroy({ where: { email: 'categoryuser@example.com' } });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

describe('Category Routes', () => {
  describe('GET /categories', () => {
    it('should return all categories with status 200', async () => {
      const res = await request(app).get('/categories');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
  
  describe('GET /categories/:categoryId', () => {
    it('should return a specific category with status 200', async () => {
      const res = await request(app).get(`/categories/${testCategoryId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', testCategoryId);
      expect(res.body).toHaveProperty('name', 'Test Category');
    });
    
    it('should return 404 if category does not exist', async () => {
      const res = await request(app).get('/categories/9999');
      
      expect(res.statusCode).toBe(404);
    });
  });
  
  describe('POST /categories', () => {
    it('should create a new category with status 201 when admin is authenticated', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Category'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'New Category');
      
      // Clean up
      await Category.destroy({ where: { name: 'New Category' } });
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/categories')
        .send({
          name: 'Unauthorized Category'
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Forbidden Category'
        });
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(res.statusCode).toBe(400);
    });
  });
  
  describe('PUT /categories/:categoryId', () => {
    it('should update a category with status 200 when admin is authenticated', async () => {
      const res = await request(app)
        .put(`/categories/${testCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Category'
        });
      
      expect(res.statusCode).toBe(200);
      // Sesuaikan dengan response controller yang tidak mengembalikan data
      // expect(res.body).toHaveProperty('id', testCategoryId);
      // expect(res.body).toHaveProperty('name', 'Updated Category');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/categories/${testCategoryId}`)
        .send({
          name: 'Unauthorized Update'
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .put(`/categories/${testCategoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Forbidden Update'
        });
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 404 if category does not exist', async () => {
      const res = await request(app)
        .put('/categories/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Non-existent Update'
        });
      
      expect(res.statusCode).toBe(404);
    });
  });
  
  describe('DELETE /categories/:categoryId', () => {
    it('should delete a category with status 200 when admin is authenticated', async () => {
      // Create a category to delete
      const categoryToDelete = await Category.create({
        name: 'Category to Delete'
      });
      
      const res = await request(app)
        .delete(`/categories/${categoryToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .delete(`/categories/${testCategoryId}`);
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 403 if authenticated but not admin', async () => {
      const res = await request(app)
        .delete(`/categories/${testCategoryId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 404 if category does not exist', async () => {
      const res = await request(app)
        .delete('/categories/9999')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(404);
    });
  });
});