'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectDB(attempt = 1) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('[DB] Connected to MongoDB successfully.');
  } catch (err) {
    logger.error(`[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);

    if (attempt < MAX_RETRIES) {
      logger.info(`[DB] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }

    logger.error('[DB] Max retries reached. Exiting.');
    process.exit(1);
  }
}

// Graceful disconnect on process termination
mongoose.connection.on('disconnected', () => {
  logger.warn('[DB] MongoDB disconnected.');
});

module.exports = connectDB;
