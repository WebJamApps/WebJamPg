import commonUtils from '../src/commonUtils';

describe('common utils', () => {
  it('should return error when missing id', () => {
    const result = commonUtils.checkIdThen({ params: {} }, { status() { return { json(obj) { return obj; } }; } }, '', {});
    expect(result.message).toBe('id is required');
  });
});
