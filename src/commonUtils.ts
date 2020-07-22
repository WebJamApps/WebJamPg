import Debug from 'debug';

const debug = Debug('webjampg:commonUtils');

const checkIdThen = (req, res, func, controller) => {
  if (req.params.id === null || req.params.id === undefined) return res.status(400).json({ message: 'id is required' });
  return controller[func](req, res);// eslint-disable-line security/detect-object-injection
};
const findAll = async (req, res, model) => {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  let allDocs;
  try { allDocs = await model.findAll(); } catch (e) { return res.status(500).json({ message: e.message }); }
  return res.status(200).json(allDocs);
};

const remove = async (model, req, res) => {
  debug('findByIdAndRemove');
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  let success = 0;
  try { success = await model.destroy({ where: { id: req.params.id } }); } catch (e) {
    return res.status(500).json({ message: e.message });
  }
  if (success > 0) return res.status(204).send();
  return res.status(400).json({ message: 'nothing was deleted' });
};

const update = async (model, req, res) => {
  debug('findByIdAndUpdate');
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  let item, uP;
  try { item = await model.findOne({ where: { id: req.params.id } }); } catch (e) {
    return res.status(500).json({ message: e.message });
  }
  if (!item) return res.status(400).json({ message: 'incorrect id' });
  try {
    item.set(req.body);
    uP = await item.save();
  } catch (e) {
    debug(e);
    return res.status(500).json({ message: e.message });
  }
  return res.status(200).json(uP);
};

const setIdRoutes = (router, controller) => {
  router.route('/:id')
    .put((req, res) => controller.findByIdAndUpdate(req, res))
    .delete((req, res) => controller.findByIdAndRemove(req, res))
    .get((req, res) => controller.findById(req, res));
};

export default {
  checkIdThen, remove, findAll, update, setIdRoutes,
};
