'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

// Use in-memory connection for tests or a dedicated test DB
beforeAll(async () => {
  process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/foodreels_test';
  process.env.JWT_SECRET = 'test_jwt_secret_at_least_32_chars_long_here';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_at_least_32_chars_long';
  process.env.NODE_ENV = 'test';

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch {
    // Skip DB-dependent tests if no test DB available
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  } catch { /* ignore */ }
});

/* ════════════════════════════════════
   User Registration
════════════════════════════════════ */
describe('POST /api/v1/auth/user/register', () => {
  const endpoint = '/api/v1/auth/user/register';

  test('registers a new user successfully', async () => {
    const res = await request(app).post(endpoint).send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test.user@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('rejects registration with duplicate email', async () => {
    const res = await request(app).post(endpoint).send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com', // duplicate
      password: 'Password123',
    });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('rejects registration with missing fields', async () => {
    const res = await request(app).post(endpoint).send({ email: 'incomplete@test.com' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('rejects weak password', async () => {
    const res = await request(app).post(endpoint).send({
      firstName: 'Test',
      lastName: 'User',
      email: 'another@test.com',
      password: 'weak',
    });
    expect(res.status).toBe(422);
  });

  test('rejects invalid email format', async () => {
    const res = await request(app).post(endpoint).send({
      firstName: 'Test',
      lastName: 'User',
      email: 'not-an-email',
      password: 'Password123',
    });
    expect(res.status).toBe(422);
  });
});

/* ════════════════════════════════════
   User Login
════════════════════════════════════ */
describe('POST /api/v1/auth/user/login', () => {
  const endpoint = '/api/v1/auth/user/login';

  test('logs in with valid credentials', async () => {
    const res = await request(app).post(endpoint).send({
      email: 'test.user@example.com',
      password: 'Password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('rejects wrong password', async () => {
    const res = await request(app).post(endpoint).send({
      email: 'test.user@example.com',
      password: 'WrongPassword123',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('rejects non-existent user', async () => {
    const res = await request(app).post(endpoint).send({
      email: 'nobody@nowhere.com',
      password: 'Password123',
    });
    expect(res.status).toBe(401);
  });

  test('rejects missing password', async () => {
    const res = await request(app).post(endpoint).send({
      email: 'test.user@example.com',
    });
    expect(res.status).toBe(422);
  });
});

/* ════════════════════════════════════
   Food Partner Auth
════════════════════════════════════ */
describe('POST /api/v1/auth/food-partner/register', () => {
  const endpoint = '/api/v1/auth/food-partner/register';

  test('registers a food partner successfully', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'Test Restaurant',
      contactName: 'Chef Test',
      email: 'chef@testrestaurant.com',
      password: 'Password123',
      phone: '+1234567890',
      address: '123 Food Street, City, Country',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.partner.role).toBe('food-partner');
  });

  test('rejects registration with missing phone', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'No Phone Restaurant',
      contactName: 'Contact',
      email: 'nophone@test.com',
      password: 'Password123',
      address: '123 Street',
    });
    expect(res.status).toBe(422);
  });
});

/* ════════════════════════════════════
   Health Check
════════════════════════════════════ */
describe('GET /health', () => {
  test('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

/* ════════════════════════════════════
   404 Handler
════════════════════════════════════ */
describe('404 handler', () => {
  test('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

/* ════════════════════════════════════
   Security
════════════════════════════════════ */
describe('Security headers', () => {
  test('response includes security headers from helmet', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
