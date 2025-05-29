const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());

// Special handling for Stripe webhook route
app.use((req, res, next) => {
  if (req.originalUrl === '/payment/webhook') {
    next(); // Skip body parsing for webhook route
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;