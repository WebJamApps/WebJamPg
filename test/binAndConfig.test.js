const server = require('../src');
const checkVar = require('../src/config/checkVar');

describe('bin and config', () => {
  it('should setup the server', () => {
    expect(server._connections).toBe(0);
  });
  it('throws error when env var is missing', () => {
    expect(() => checkVar.fetchEnv('BO_GUS')).toThrow('You must provide a value for environmental variable BO_GUS');
  });
});
