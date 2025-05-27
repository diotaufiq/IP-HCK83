const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const { authorization } = req.headers;
    if (!authorization) {
      throw { status: 401, message: 'Please login first' };
    }

    // Verify token
    const token = authorization.split(' ')[1];
    const payload = verifyToken(token);

    // Find user
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { status: 401, message: 'Invalid token' };
    }

    // Set user in request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;