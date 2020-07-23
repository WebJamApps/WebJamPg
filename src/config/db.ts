import dotenv from 'dotenv';
import Debug from 'debug';
import { Sequelize } from 'sequelize';
import sStub from './sStub';

const debug = Debug('web-jam-back:index');
dotenv.config();
// eslint-disable-next-line import/no-mutable-exports
let sequelize;
/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') sequelize = sStub.sStub;
else sequelize = new Sequelize(`${process.env.POSTGRES_URI}`);
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'development') sequelize.options.logging = false;
(async () => {
  try {
    await sequelize.authenticate();
  } catch (e) { /* istanbul ignore next */return debug('Unable to connect to the database:', e); }
  return debug('Connection has been established successfully.');
})();
export default sequelize;
