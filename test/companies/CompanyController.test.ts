import sinon from 'sinon';
import controller from '../../src/company/CompanyController';

const resStub = { status() { return { json(obj) { return Promise.resolve(obj); } }; } };
describe('CompanyController', () => {
  let r;
  it('catches error on findAll', async () => {
    controller.model.findAll = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.find({}, resStub);
    expect(r.message).toBe('bad');
  });
  it('catches error on model.create', async () => {
    controller.model.create = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.create({ body: {} }, resStub);
    expect(r.message).toBe('bad');
  });
  it('catches error on update with findOne', async () => {
    const cMock = sinon.mock(controller.model);
    cMock.expects('findOne').rejects(new Error('bad'));
    r = await controller.update({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('bad');
    cMock.restore();
  });
  it('returns error on update with findOne does not find a playlist', async () => {
    const cMock = sinon.mock(controller.model);
    cMock.expects('findOne').resolves(null);
    r = await controller.update({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('incorrect id');
    cMock.restore();
  });
  it('returns error on update with save', async () => {
    const cMock = sinon.mock(controller.model);
    cMock.expects('findOne').resolves({ id: '999999999999' });
    r = await controller.update({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('item.set is not a function');
    cMock.restore();
  });
  it('catches error on destroy', async () => {
    const cMock = sinon.mock(controller.model);
    cMock.expects('destroy').rejects(new Error('bad'));
    r = await controller.remove({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('bad');
    cMock.restore();
  });
  it('returns error when no rows are deleted', async () => {
    const cMock = sinon.mock(controller.model);
    cMock.expects('destroy').resolves(0);
    r = await controller.remove({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('nothing was deleted');
    cMock.restore();
  });
  it('returns 500 on findById from this.model', async () => {
    controller.model.findOne = jest.fn(() => Promise.reject(new Error('bad')));
    r = await controller.findById({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('bad');
  });
  it('returns 400 on findById from this.model', async () => {
    controller.model.findOne = jest.fn(() => Promise.resolve());
    r = await controller.findById({ params: { id: '3' }, body: {} }, resStub);
    expect(r.message).toBe('incorrect id');
  });
  it('returns 200 on findById from this.model', async () => {
    controller.model.findOne = jest.fn(() => Promise.resolve({ name: 'First University' }));
    r = await controller.findById({ params: { id: '3' }, body: {} }, resStub);
    expect(r.name).toBe('First University');
  });
});
