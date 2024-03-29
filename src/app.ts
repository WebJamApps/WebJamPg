import express from 'express';
import dotenv from 'dotenv';
import Debug from 'debug';
import bodyParser from 'body-parser';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import fs from 'fs';
// import sdc from './config/SDC';
import iRouter from './routes';
import cRouter from './company';
import uRouter from './user';
import './config/db';

dotenv.config();
const debug = Debug('webjampg:app');

const corsOptions = {
  origin: JSON.parse(process.env.AllowUrl || /* istanbul ignore next */'{}').urls,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = express();
// debug(sdc);
const root = '../';
const logDirectory = path.join(__dirname, `${root}${process.env.UPLOAD_PATH}/logs`);
// ensure log directory exists
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdir(path.join(logDirectory), (err) => {
  /* istanbul ignore else */
  if (!err || err.message.includes('EEXIST')) return debug('logDirectory created successfully');
  /* istanbul ignore next */return debug(err.message);
});
const iconsDir = path.join(__dirname, `${root}${process.env.UPLOAD_PATH}/icons`);
// ensure icon directory exists
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdir(iconsDir, (err) => {
  /* istanbul ignore else */
  if (!err || err.message.includes('EEXIST')) return debug('iconsDir created successfully');
  /* istanbul ignore next */return debug(err.message);
});
// eslint-disable-next-line security/detect-non-literal-fs-filename
const accessLogStream = fs.createWriteStream(`${logDirectory}/access.log`, { flags: 'a' });
// app.use(express.static(path.normalize(path.join(__dirname, `${root}front-end/dist`))));
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
export default app;
