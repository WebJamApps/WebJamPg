require('dotenv').config();
const checkVar = require('./checkVar');

const config = {
  env: checkVar.fetchEnv('NODE_ENV'),
  port: checkVar.fetchEnv('PORT'),
  pgUri: checkVar.fetchEnv('POSTGRES_URI'),
  sdApiName: checkVar.fetchEnv('SD_API_NAME'),
  statsd: checkVar.fetchEnv('STATSD'),
  uPath: checkVar.fetchEnv('UPLOAD_PATH'),
};

module.exports = config;
