const makeTableRows = require('./makeTableRows');
const sq = require('./db');

makeTableRows.runEverything().then(async () => {
  await sq.close();
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') process.exit();
});
