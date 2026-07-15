const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const referralRoutes = require('./routes/referralRoutes');
const kitRoutes = require('./routes/kitRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

function parseAllowedOrigins(value = '') {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function createApp(env = process.env) {
  const app = express();
  const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGINS || 'http://localhost:5173');
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use('/api/products', productRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/referral', referralRoutes);
  app.use('/api/kits', kitRoutes);

  app.get('/', (_req, res) => {
    res.json({ name: 'KitchenLux storefront prototype API', status: 'ok' });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp, parseAllowedOrigins };
