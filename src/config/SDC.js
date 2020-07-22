require('dotenv').config();
const SDC = require('statsd-client');

module.exports = new SDC({ host: process.env.STATSD });
