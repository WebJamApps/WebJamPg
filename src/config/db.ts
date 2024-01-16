import dotenv from 'dotenv';
import Debug from 'debug';
import { Sequelize } from 'sequelize';
import sStub from './sStub';

const debug = Debug('web-jam-back:index');
dotenv.config();
// eslint-disable-next-line import/no-mutable-exports
let sequelize;
try{
/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') sequelize = sStub.sStub;
else sequelize = new Sequelize(`${process.env.POSTGRES_URI}`, { dialect: 'postgres' });
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'development') sequelize.options.logging = false;
(async () => {
  try {
    //console.log(sequelize);
    await sequelize.authenticate();
  } catch (e) { /* istanbul ignore next */return debug('Unable to connect to the database:', e); }
  return debug('Connection has been established successfully.');
})();
}catch(err){console.log((err as Error).message)}
export default sequelize;
