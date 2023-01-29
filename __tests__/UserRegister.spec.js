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
  const postValidUser = async () => {
    return await request(app).post('/api/v1/users').send({
      username: 'user1',
      email: 'user1@mail.com',
      password: 'password',
    });
  };

  it('returns 200 ok when signup is valid', async () => {
    const response = await postValidUser();

    expect(response.status).toBe(200);
  });

  it('returns success message when signup is valid', async () => {
    const response = await postValidUser();

    expect(response.body.message).toBe('User Created');
  });

  it('should save user to db', async () => {
    await postValidUser();

    const userList = await User.findAll();

    expect(userList.length).toBe(1);
  });

  it('should save username and password to db', async () => {
    await postValidUser();

    const user = await User.findOne({ where: { username: 'user1' } });

    expect(user.username).toBe('user1');
    expect(user.email).toBe('user1@mail.com');
  });

  it('should hash password', async () => {
    await postValidUser();
    const user = User.findOne({ where: { username: 'user1' } });

    expect(user.password).not.toBe('password');
  });
});
