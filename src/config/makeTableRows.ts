import dotenv from 'dotenv';
import Debug from 'debug';
import bcrypt from 'bcryptjs';
import sq from './db';
import userModel from '../user/user.model';
import companyModel from '../company/company.model';
dotenv.config();
const debug = Debug('webjampg:makeTableRows');
let p1, p2;
const doExit = (message) => {
  debug(message);
  if (message.includes('populated')) return Promise.resolve(true);
  return Promise.reject(new Error(message));
};
const runSyncInOrder = async () => {
  try {
    await sq.drop({ cascade: true });
    await companyModel.sync();
    await userModel.sync();
  } catch (e) { return Promise.reject(e); }
  debug('runSyncInOrder finished');
  return true;
};
const runBulkInserts = async () => {
  const userArr = [
    { username: 'tester1', password: p1, pin: '1111' }, { username: 'tester2', password: p2, pin: '2222' },
  ];
  const companyArr = [{
    name: 'First University',
    type: 'university',
    slogan: 'penguin',
    number_employees: 20000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    name: 'Andrew Lewis',
    type: 'middle school',
    slogan: 'wolverine',
    number_employees: 350,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ];
  try {
    await sq.queryInterface.bulkDelete('companies', {});
    await sq.queryInterface.bulkInsert('companies', companyArr);
    await sq.queryInterface.bulkDelete('users', {});
    await sq.queryInterface.bulkInsert('users', userArr);
  } catch (e) { return Promise.reject(e); }
  return true;
};
const setUsers = async () => {
  let companies, users;
  try {
    companies = await companyModel.findAll();
    users = await userModel.findAll();
    companies[0].addUser(users[0].id);
  } catch (e) { return Promise.reject(e); }
  return true;
};
const runEverything = async () => {
  debug('runEverything');
  try {
    p1 = await bcrypt.hash('password1', 10);
    p2 = await bcrypt.hash('password2', 10);
    debug('line 87');
    await runSyncInOrder();
    await runBulkInserts();
    await setUsers();
  } catch (e) { return doExit(e.message); }
  return doExit('db has been populated');
};
export default { runEverything, runSyncInOrder };
