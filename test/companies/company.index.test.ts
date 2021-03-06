import request from 'supertest';
import model from '../../src/company/company.model';
import app from '../../src/app';
import sequalize from '../../src/config/db';

describe('company routes', () => {
  let server, agent;
  beforeAll((done) => {
    server = app.listen(Number(process.env.PORT) + 10, (err) => {
      if (err) return done(err);
      agent = request.agent(server);
      return done();
    });
  });
  beforeEach(async () => {
    await model.destroy({
      where: {},
      truncate: true,
    });
  });
  afterAll(async (done) => {
    await server.close();
    sequalize.close();
    done();
  });
  it('performs company CRUD', async () => {
    const result = await agent
      .post('/api/company')
      .send({
        name: 'Country',
      });
    expect(result.status).toBe(201);
    const pMany = await agent
      .get('/api/company');
    expect(pMany.body.length).toBe(9);
    const pU = await agent
      .put(`/api/company/${result.body.id}`)
      .send({
        name: 'Max',
      });
    expect(pU.status).toBe(200);
    expect(pU.body.name).toBe('Max');
    expect(pU.body.id).toBe(result.body.id);
    const cById = await agent
      .get(`/api/company/${result.body.id}`);
    expect(cById.status).toBe(200);
    const goodDelete = await agent
      .delete(`/api/company/${result.body.id}`);
    expect(goodDelete.status).toBe(204);
  });
});
