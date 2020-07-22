import makeTableRows from './makeTableRows';
import sq from './db';

makeTableRows.runEverything().then(async () => {
  await sq.close();
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') process.exit();
});
