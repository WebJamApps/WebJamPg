import dotenv from 'dotenv';
import SDC from 'statsd-client';
dotenv.config();
export default new SDC({ host: process.env.STATSD });
