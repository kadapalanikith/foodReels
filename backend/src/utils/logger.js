'use strict';

const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

const isDev = process.env.NODE_ENV !== 'production';

// Human-readable format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Structured JSON format for production (feeds into log aggregators)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
  ],
  exitOnError: false,
});

// In production, also write to files if writable
if (!isDev) {
  try {
    logger.add(new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5_242_880, // 5MB
      maxFiles: 5,
    }));
    logger.add(new transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5_242_880,
      maxFiles: 5,
    }));
  } catch {
    // If logs dir is not writable (e.g. Render), use console only
  }
}

module.exports = logger;
