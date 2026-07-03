const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fundRoutes = require('./routes/funds');
const allocationRoutes = require('./routes/allocations');
const transactionRoutes = require('./routes/transactions');
const resourceRoutes = require('./routes/resources');
const analyticsRoutes = require('./routes/analytics');
const anomalyRoutes = require('./routes/anomalies');
const userRoutes = require('./routes/users');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FundTrack AFRICA Backend is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/funds', fundRoutes);
app.use('/api/v1/allocations', allocationRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/anomalies', anomalyRoutes);
app.use('/api/v1/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`FundTrack AFRICA Backend running on port ${PORT}`);
});

module.exports = app;
