const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');
const {OAuth2Client} = require('google-auth-library'); // Assuming you
const { use } = require('../routes');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Set your Google Client ID here
class UserController {

  static async googleLogin(req, res, next) {
    try {
      console.log('Request body:', req.body);
      const { id_token, credential } = req.body;
      console.log('Extracted tokens:', { id_token, credential });
      
      // Use credential if provided (new Google Sign-In), otherwise use id_token (older version)
      const tokenToVerify = credential || id_token;
      
      if (!tokenToVerify) {
        return res.status(400).json({ message: 'ID token is required' });
      }

      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: tokenToVerify,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();

      // Validate payload
      if (!payload || !payload.email) {
        return res.status(400).json({ message: 'Invalid Google token payload' });
      }

      // Check if user already exists
      let user = await User.findOne({ where: { email: payload.email } });
      if (!user) {
        // Create new user if not exists
        user = await User.create({
          username: payload.name || payload.email.split('@')[0], // Fallback if name is not provided
          email: payload.email,
          password: 'google-auth', // Placeholder password
          role: 'customer'
        });
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.status(200).json({
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('Google login error:', err);
      // Send more specific error messages
      if (err.message && err.message.includes('Token used too late')) {
        return res.status(400).json({ message: 'Google token has expired. Please try again.' });
      }
      if (err.message && err.message.includes('Invalid token')) {
        return res.status(400).json({ message: 'Invalid Google token. Please try again.' });
      }
      next(err);
    }
  }
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      const user = await User.create({
        username,
        email,
        password
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      next(err);
    }
  }
  
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        throw { status: 400, message: 'Email and password are required' };
      }
      
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { status: 401, message: 'Invalid email or password' };
      }
      
      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw { status: 401, message: 'Invalid email or password' };
      }
      
      // Generate token with role
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      // Return response matching test expectations
      res.status(200).json({
        access_token: token,
        username: user.username, // Add username to match test
        email: user.email,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;