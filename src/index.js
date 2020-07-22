require('dotenv').config();
const http = require('http');
const config = require('./config/config');
const app = require('./app');

const { port } = config;
app.set('port', port);
app.set('env', config.env);

const server = http.createServer(app);
/* istanbul ignore next */
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string'
    ? `pipe ${port}`
    : `port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} require elevated privileges.`); // eslint-disable-line no-console
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`); // eslint-disable-line no-console
      process.exit(1);
    default: throw error;
  }
}
/* istanbul ignore next */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`web server listening on ${bind}`); // eslint-disable-line no-console
}
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = server;
