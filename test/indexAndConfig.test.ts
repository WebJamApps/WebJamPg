import server from '../src';
import checkVar from '../src/config/checkVar';

describe('index and config', () => {
  it('should setup the server', () => {
    const s:any = server;
    const r = s.getConnections(jest.fn());
    expect(r._connections).toBe(0);
  });
  it('throws error when env var is missing', () => {
    expect(() => checkVar.fetchEnv('BO_GUS')).toThrow('You must provide a value for environmental variable BO_GUS');
  });
});
