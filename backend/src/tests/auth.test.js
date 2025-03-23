const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Authentication', () => {
  beforeAll(async () => {
    // Préparation de la base de données de test
    await User.sync({ force: true });
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should login registered user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});