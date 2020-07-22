import req from 'supertest';
import app from '../../src/app';
import sStub from '../../src/config/sStub';

describe('index routes', () => {
  // let agent, server:any;
  // beforeAll(async() => {
  //   server = await app.listen(process.env.PORT, () => {
  //     agent = request.agent(server);
  //   });
  // });
  // afterAll(async () => {
  //   await server.close();
  // });
  it('should check system health', async () => {
    const r = await req(app).get('/api/health-check');
    expect(r.status).toBe(200);
  });
  it('resets the database', async () => {
    const r = await req(app).get('/api/reset-db');
    expect(r.status).toBe(200);
  });
  it('catches error on reset the database', async () => {
    sStub.sStub.drop = jest.fn(() => Promise.reject(new Error('bad')));
    const r = await req(app).get('/api/reset-db');
    expect(r.status).toBe(500);
  });
  it('catches error on reset the database, bulkInsert', async () => {
    sStub.sStub.drop = () => Promise.resolve(true);
    sStub.sStub.queryInterface.bulkInsert = jest.fn(() => Promise.reject(new Error('bad')));
    const r = await req(app).get('/api/reset-db');
    expect(r.status).toBe(500);
  });
});
