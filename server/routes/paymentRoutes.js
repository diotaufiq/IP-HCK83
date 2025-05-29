const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require('../middlewares/authentication');

// Apply authentication middleware to protect payment routes
router.use(authentication);

// Create checkout session
router.post('/create-checkout-session', PaymentController.createCheckoutSession);

// Handle successful payment
router.get('/success', PaymentController.handlePaymentSuccess);

// Handle canceled payment
router.get('/cancel', (req, res) => {
  res.status(200).json({ message: 'Payment canceled' });
});

// Webhook for Stripe events (this route should be public)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Raw body for webhook signature verification
  PaymentController.handlePaymentWebhook
);

module.exports = router;