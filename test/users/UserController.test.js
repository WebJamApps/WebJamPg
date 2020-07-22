const controller = require('../../src/user/UserController');
const sequalize = require('../../src/config/db');

const resStub = { status() { return { json(obj) { return Promise.resolve(obj); } }; } };
describe('UserController', () => {
  let r;
  afterAll((done) => {
    sequalize.close();
    done();
  });
  it('returns 500 on getUsers', async () => {
    controller.model.findAll = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.getUsers({}, resStub);
    expect(r.message).toBe('Unable to get users, bad');
  });
  it('returns 500 when password hash failed during create user', async () => {
    controller.bcrypt.hash = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.create({ body: { username: 'justin bieber', password: 'cool', pin: 2345 } }, resStub);
    expect(r.message).toBe('Failed to create user, bad');
  });
  it('returns 500 when model.create user fails', async () => {
    controller.bcrypt.hash = jest.fn(() => Promise.resolve('hashy'));
    controller.model.create = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.create({ body: { username: 'justin bieber', password: 'cool', pin: 2345 } }, resStub);
    expect(r.message).toBe('Failed to create user, bad');
  });
  it('returns 404 when user is not found with pin requested', async () => {
    controller.model.findAll = jest.fn(() => Promise.resolve([]));
    r = await controller.checkPin({ body: { pin: 4561 } }, resStub);
    expect(r.message).toBe('There are no users with that pin');
  });
  it('returns 500 from checkPin request', async () => {
    controller.model.findAll = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.checkPin({ body: { pin: 4561 } }, resStub);
    expect(r.message).toBe('Unable to get users with pin: 4561, bad');
  });
  it('returns 400 from loginUser request', async () => {
    controller.model.findOne = jest.fn(() => Promise.resolve());
    r = await controller.loginUser({ body: { username: 'Justin Bieber', password: 'password' } }, resStub);
    expect(r.message).toBe('Justin Bieber was not found');
  });
  it('returns 500 from loginUser request, model.findOne', async () => {
    controller.model.findOne = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.loginUser({ body: { username: 'Justin Bieber', password: 'password' } }, resStub);
    expect(r.message).toBe('bad');
  });
  it('returns 500 from loginUser request, brypt.compare', async () => {
    controller.model.findOne = jest.fn(() => Promise.resolve({ username: 'Justin Bieber', password: 'password' }));
    controller.bcrypt.compare = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.loginUser({ body: { username: 'Justin Bieber', password: 'password' } }, resStub);
    expect(r.message).toBe('bad');
  });
  it('returns 400 from loginUser request, incorrect password', async () => {
    controller.model.findOne = jest.fn(() => Promise.resolve({ username: 'Justin Bieber', password: 'booya' }));
    controller.bcrypt.compare = jest.fn(() => Promise.resolve(false));
    r = await controller.loginUser({ body: { username: 'Justin Bieber', password: 'password' } }, resStub);
    expect(r.message).toBe('Incorrect password');
  });
  it('returns 400 from updateUser when id is missing', async () => {
    r = await controller.updateUser({ params: {}, body: { username: 'Justin Bieber', password: 'password', pin: 4561 } }, resStub);
    expect(r.message).toBe('User id is missing');
  });
  it('returns 400 from updateUser when pin is invalid', async () => {
    r = await controller.updateUser({ params: { id: '456' }, body: { username: 'Justin Bieber', password: 'password', pin: 'booya' } }, resStub);
    expect(r.message).toBe('Submit a valid 4-digit pin');
  });
  it('returns 400 from updateUser when req.body is invalid', async () => {
    r = await controller.updateUser({ params: { id: '456' }, body: { username: 'Justin Bieber', pin: 4561 } }, resStub);
    expect(r.message).toBe('Invalid request to update user');
  });
  it('returns 500 from updateUser', async () => {
    controller.model.update = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.updateUser({ params: { id: '456' }, body: { username: 'Justin Bieber', password: 'cool', pin: 4561 } }, resStub);
    expect(r.message).toBe('There was an error updating this user, bad');
  });
  it('returns 500 from deleteUser', async () => {
    controller.model.destroy = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.deleteUser({ params: { id: '456' }, body: { } }, resStub);
    expect(r.message).toBe('Failed to delete user, bad');
  });
});
