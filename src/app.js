require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('webjampg:app');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const sdc = require('./config/SDC');
const iRouter = require('./routes');
const cRouter = require('./company');
const uRouter = require('./user');

require('./config/db');

const corsOptions = {
  origin: JSON.parse(process.env.AllowUrl).urls,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = express();
debug(sdc);
const root = '../';
const logDirectory = path.join(__dirname, `${root}${process.env.UPLOAD_PATH}/logs`);
// ensure log directory exists
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdir(path.join(logDirectory), (err) => {
  if (!err || err.message.includes('EEXIST')) return debug('logDirectory created successfully');
  return debug(err.message);
});
// shell.mkdir('-p', logDirectory);
const iconsDir = path.join(__dirname, `${root}${process.env.UPLOAD_PATH}/icons`);
// ensure log directory exists
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdir(iconsDir, (err) => {
  if (!err || err.message.includes('EEXIST')) return debug('iconsDir created successfully');
  return debug(err.message);
});
// shell.mkdir('-p', iconsDir);
// eslint-disable-next-line security/detect-non-literal-fs-filename
const accessLogStream = fs.createWriteStream(`${logDirectory}/access.log`, { flags: 'a' });
app.use(express.static(path.normalize(path.join(__dirname, `${root}front-end/dist`))));
app.use(cors(corsOptions));
app.use(helmet());
// Body Parser Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// default options
app.use(fileUpload());
// setup logger for HTTP requests
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", '
+ '"method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": '
+ '":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', { stream: accessLogStream }));
app.use('/api', iRouter);
app.use('/api/company', cRouter);
app.use('/api/user', uRouter);
// app.get('*', (req, res) => res.sendFile(path.normalize(path.join(__dirname, `${root}front-end/dist/index.html`))));
debug(app.settings);
module.exports = app;
