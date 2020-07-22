require('dotenv').config();
const debug = require('debug')('webjampg:db');
const { Sequelize } = require('sequelize');
const sStub = require('./sStub');

let sequelize;
/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') sequelize = sStub.sStub;
else sequelize = new Sequelize(`${process.env.POSTGRES_URI}`);
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'development') sequelize.options.logging = false;
(async () => {
  try {
    await sequelize.authenticate();
  } catch (e) { return debug('Unable to connect to the database:', e); }
  return debug('Connection has been established successfully.');
})();
module.exports = sequelize;
