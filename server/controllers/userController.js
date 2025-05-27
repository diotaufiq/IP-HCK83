const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

class UserController {
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
        email: user.email
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
      
      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email
      });
      
      res.status(200).json({
        access_token: token,
        username: user.username,
        email: user.email
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;