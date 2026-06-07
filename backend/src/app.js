'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

/* ─── Trust proxy (required for Render / Vercel) ─── */
app.set('trust proxy', 1);

/* ─── Security headers ─── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow video streaming
  })
);

/* ─── CORS — hardened for production ─── */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ─── General rate limit — 100 req / 15 min per IP ─── */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

/* ─── Strict rate limit for auth endpoints — 10 req / 15 min ─── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

app.use(generalLimiter);

/* ─── Body parsing ─── */
app.use(express.json({ limit: '10kb' }));        // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

/* ─── NoSQL injection prevention ─── */
app.use(mongoSanitize());

/* ─── Compression ─── */
app.use(compression());

/* ─── Request logging ─── */
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

/* ─── Health check (for Render) ─── */
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FoodReels API is healthy.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ─── API routes (versioned) ─── */
app.use('/api/v1/auth',         authLimiter, authRoutes);
app.use('/api/v1/food',         foodRoutes);
app.use('/api/v1/food-partner', foodPartnerRoutes);

/* ─── 404 handler ─── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

/* ─── Centralized error handler (must be last) ─── */
app.use(errorHandler);

module.exports = app;