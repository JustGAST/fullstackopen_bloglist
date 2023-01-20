const supertest = require('supertest');

const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('addition of a new user', () => {
  test('succeeds with valid data', async () => {
    const userResponse = await api
      .post('/api/users')
      .send({
        username: 'newuser',
        name: 'New User',
        password: 'secret',
      })
      .expect(201);

    expect(userResponse.body.username).toBe('newuser');
    expect(userResponse.body.name).toBe('New User');
    expect(userResponse.body.password).not.toBeDefined();
    expect(userResponse.body.passwordHash).not.toBeDefined();

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(1);
  });

  test('fails with empty data', async () => {
    const userResponse = await api.post('/api/users').expect(400);

    expect(userResponse.body.error).toBe('missing data');
  });

  test('fails with short username', async () => {
    const userResponse = await api
      .post('/api/users')
      .send({
        username: 'A',
        name: 'Aaaaaa',
        password: 'Aaaaa',
      })
      .expect(400);

    expect(userResponse.body.error).toContain(
      'User validation failed: username'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(0);
  });

  test('fails with short password', async () => {
    const userResponse = await api
      .post('/api/users')
      .send({
        username: 'Aaaaa',
        name: 'Aaaaaa',
        password: 'Aa',
      })
      .expect(400);

    expect(userResponse.body.error).toContain(
      'password should be longer than 3 symbols'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(0);
  });
});
