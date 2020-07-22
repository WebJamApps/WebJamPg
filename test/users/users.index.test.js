const req = require('supertest');
const app = require('../../src/app');
const controller = require('../../src/user/UserController');

describe('/users C.R.U.D.', () => {
  let r;
  it('GET /users', async () => {
    r = await req(app)
      .get('/api/user');
    expect(r.status).toBe(200);
  });
  it('POST /users', async () => {
    r = await req(app)
      .post('/api/user')
      .send({
        id: 1, username: '1', password: '1', pin: 1111,
      });
    expect(r.status).toBe(200);
  });
  it('PUT /users', async () => {
    r = await req(app)
      .put('/api/user/1')
      .send({ username: '2', password: '2', pin: 2222 });
    expect(r.status).toBe(200);
  });
  it('Deletes /users', async () => {
    r = await req(app)
      .delete('/api/user/1');
    expect(r.status).toBe(200);
  });
  it('POST /users/pincode', async () => {
    r = await req(app)
      .post('/api/user/pincode')
      .send({ pin: 1111 });
    expect(r.status).toBe(200);
  });
  it('POST /users/login', async () => {
    controller.bcrypt.compare = jest.fn(() => Promise.resolve(true));
    r = await req(app)
      .post('/api/user/login')
      .send({ username: '1', password: '1' });
    expect(r.status).toBe(200);
  });
});
describe('users rout', () => {
  it('should come back with user object', async () => {
    const res = await req(app).get('/api/user');
    expect(res.body).toBeInstanceOf(Object);
  });
  it('should come back with error object', async () => {
    const res = await req(app).get('/api/user');
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe('POST routes', () => {
  it('POST /users', async () => {
    const res = await req(app)
      .post('/api/user')
      .send({
        id: 666,
        username: 'newguy',
        password: 'newpass',
        pin: 1111,
      });
    expect(res.body).toEqual({ message: 'created user: undefined' });
  });
  it('POST routes login on empty req', async () => {
    const res = await req(app)
      .post('/api/user/login')
      .send({});
    expect(res.body).toEqual({ message: 'Please submit a username' });
  });
  it('POST /users pincode empty request', async () => {
    const res = await req(app)
      .post('/api/user/pincode')
      .send({});
    expect(res.body).toEqual({ message: 'Submit a valid 4-digit pin' });
  });
  it('POST /users to create but nothing in body', async () => {
    const res = await req(app)
      .post('/api/user');
    expect(res.status).toBe(400);
  });
  it('POST /users/login returns 400 when username is not provided', async () => {
    const res = await req(app)
      .post('/api/user/login');
    expect(res.status).toBe(400);
  });
  it('tests post /users no password', async () => {
    const res = await req(app)
      .post('/api/user/login')
      .send({ username: 'newguy' });
    expect(res.body).toEqual({ message: 'Please submit a valid password' });
  });
  it('tests post /users no username', async () => {
    const res = await req(app)
      .post('/api/user/login')
      .send({ superhero: 'newguy' });
    expect(res.body).toEqual({ message: 'Please submit a username' });
  });
});
describe('delete /users', () => {
  it('delete /users/666', async () => {
    const res = await req(app)
      .delete('/api/user/666');
    expect(res.body).toEqual({ message: 'deleted user: true' });
  });
});
