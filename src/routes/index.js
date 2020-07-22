// const express = require('express');
const { Router } = require('express');
const debug = require('debug')('webjampg:routes');
const makeTableRows = require('../config/makeTableRows');

// const path = require('path');

const router = Router();
// const frontend = Router();
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

module.exports = router;
