'use strict';

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_URL_ENDPOINT',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `[FATAL] Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
        'Copy .env.example to .env and fill in all values.'
    );
    process.exit(1);
  }

  // Warn about insecure defaults
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('[WARN] JWT_SECRET is shorter than 32 characters — use a stronger secret in production.');
  }

  console.log('[Config] Environment validated successfully.');
}

module.exports = { validateEnv };
