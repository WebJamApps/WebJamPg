const request = require('supertest');
const app = require('../../src/app');
const sStub = require('../../src/config/sStub');

describe('index routes', () => {
  let agent, server;
  beforeAll((done) => {
    server = app.listen(process.env.PORT, (err) => {
      if (err) return done(err);
      agent = request.agent(server);
      return done();
    });
  });
  afterAll(async () => {
    await server.close();
  });
  it('should check system health', async () => {
    const r = await agent.get('/api/health-check');
    expect(r.status).toBe(200);
  });
  it('resets the database', async () => {
    const r = await agent.get('/api/reset-db');
    expect(r.status).toBe(200);
  });
  it('catches error on reset the database', async () => {
    sStub.sStub.drop = jest.fn(() => Promise.reject(new Error('bad')));
    const r = await agent.get('/api/reset-db');
    expect(r.status).toBe(500);
  });
  it('catches error on reset the database, bulkInsert', async () => {
    sStub.sStub.drop = () => Promise.resolve(true);
    sStub.sStub.queryInterface.bulkInsert = jest.fn(() => Promise.reject(new Error('bad')));
    const r = await agent.get('/api/reset-db');
    expect(r.status).toBe(500);
  });
});
