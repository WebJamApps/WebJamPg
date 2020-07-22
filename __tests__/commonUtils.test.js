const cU = require('../server/commonUtils');

describe('common utils', () => {
  it('should return error when missing id', () => new Promise((done) => {
    const result = cU.checkIdThen({ params: {} }, { status() { return { json(obj) { return obj; } }; } }, '', {});
    expect(result.message).toBe('id is required');
    done();
  }));
});
