const { User } = require('../models');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Untuk sederhananya, kita anggap user dengan email superadmin@mail.com adalah admin
    if (user.role !== 'superadmin') {
      throw { status: 403, message: 'Forbidden access' };
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isAdmin };