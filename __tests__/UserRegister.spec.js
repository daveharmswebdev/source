const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe('User Registration suite', () => {
  const validUser = {
    username: 'user1',
    email: 'user1@mail.com',
    password: 'password',
  };

  const postUser = async (user = validUser) => {
    return await request(app).post('/api/v1/users').send(user);
  };

  it('returns 200 ok when signup is valid', async () => {
    const response = await postUser();

    expect(response.status).toBe(200);
  });

  it('returns success message when signup is valid', async () => {
    const response = await postUser();

    expect(response.body.message).toBe('User Created');
  });

  it('should save user to db', async () => {
    await postUser();

    const userList = await User.findAll();

    expect(userList.length).toBe(1);
  });

  it('should save username and password to db', async () => {
    await postUser();

    const user = await User.findOne({ where: { username: 'user1' } });

    expect(user.username).toBe('user1');
    expect(user.email).toBe('user1@mail.com');
  });

  it('should hash password', async () => {
    await postUser();
    const user = User.findOne({ where: { username: 'user1' } });

    expect(user.password).not.toBe('password');
  });

  it('returns 400 when username is null', async () => {
    const { status } = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'password',
    });

    expect(status).toBe(400);
  });

  it('should return validation errors field in response body when validation error', async () => {
    const response = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'password',
    });

    expect(response.body.validationErrors).not.toBeUndefined();
  });

  it('returns "username cannot be null" username is null', async () => {
    const response = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'password',
    });

    expect(response.body.validationErrors.username).toBe('Username cannot be null');
  });
});
