const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');

let testToken;
let testUserId;

beforeAll(async () => {
  // Create a test user for authentication tests
  try {
    await User.destroy({ where: { email: 'test@example.com' } });
    
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    testUserId = testUser.id;
    testToken = generateToken({
      id: testUser.id,
      email: testUser.email,
      role: testUser.role
    });
  } catch (error) {
    console.error('Setup error:', error);
  }
});

afterAll(async () => {
  // Clean up test data
  try {
    await User.destroy({ where: { email: 'test@example.com' } });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

describe('User Routes', () => {
  describe('POST /users/register', () => {
    it('should register a new user with status 201', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'newuser');
      expect(res.body).toHaveProperty('email', 'new@example.com');
      expect(res.body).toHaveProperty('role', 'customer');
      
      // Clean up
      await User.destroy({ where: { email: 'new@example.com' } });
    });
    
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'incomplete',
          // Missing email and password
        });
      
      expect(res.statusCode).toBe(400);
    });
    
    it('should return 400 if email is already in use', async () => {
      // First create a user
      await request(app)
        .post('/users/register')
        .send({
          username: 'duplicate',
          email: 'duplicate@example.com',
          password: 'password123'
        });
      
      // Try to create another user with the same email
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'another',
          email: 'duplicate@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
      
      // Clean up
      await User.destroy({ where: { email: 'duplicate@example.com' } });
    });
  });
  
  describe('POST /users/login', () => {
    it('should login a user with status 200', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('role', 'customer');
    });
    
    it('should return 401 if credentials are invalid', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 401 if user does not exist', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(401);
    });
    
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
    });
    
    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });
});