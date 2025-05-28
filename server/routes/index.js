const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const carRoutes = require('./carRoutes');
const categoryRoutes = require('./categoryRoutes');
const aiRoutes = require('./aiRoutes');
const wishlistRoutes = require('./wishlistRoute');

router.use('/users', userRoutes);
router.use('/cars', carRoutes);
router.use('/categories', categoryRoutes);
router.use('/ai', aiRoutes);
router.use('/wishlists',wishlistRoutes)

module.exports = router;