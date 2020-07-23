import express from 'express';
import Debug from 'debug';
import makeTableRows from '../config/makeTableRows';

const debug = Debug('webjampg:routes');

const router = express.Router();
const resetDb = async (req, res) => {
  debug('resetDB');
  try { await makeTableRows.runEverything(); } catch (e) { return res.status(500).json({ message: e.message }); }
  return res.status(200).json({ status: 200, message: 'db was reset' });
};
router.route('/health-check')
  .get((req, res) => res.status(200).json({ status: 200, message: 'Server is connected' }));

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  router.route('/reset-db')
    .get((req, res) => resetDb(req, res));
}

export default router;
