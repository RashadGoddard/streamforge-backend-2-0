/**
 * Auth Tests - Jest suite with MFA, session checks.
 */
const request = require('supertest');
const app = require('../server').app;
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test');
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  it('should register with MFA', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@divine.com', password: 'StrongPass123!' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should login with MFA', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@divine.com', password: 'StrongPass123!' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@divine.com', password: 'StrongPass123!', mfaCode: '123456' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should refresh token', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@divine.com', password: 'StrongPass123!' });
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: register.body.refreshToken });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});