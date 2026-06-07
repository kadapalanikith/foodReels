'use strict';

require('dotenv').config();

const { validateEnv } = require('./src/config/env');
validateEnv(); // Fail fast if any required env var is missing

const app = require('./src/app');
const connectDB = require('./src/db/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000; // FIX: was hardcoded 3000

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`[Server] FoodReels API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });

  /* ─── Graceful shutdown ─── */
  const shutdown = (signal) => {
    logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('[Server] HTTP server closed.');
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown stalls
    setTimeout(() => {
      logger.error('[Server] Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('[Server] Unhandled Promise Rejection:', reason);
  });
}

startServer();
