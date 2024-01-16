import Debug from 'debug';

const debug = Debug('webjampg:commonUtils');

const checkIdThen = (req, res, func, controller) => {
  if (req.params.id === null || req.params.id === undefined) return res.status(400).json({ message: 'id is required' });
  return controller[func](req, res);// eslint-disable-line security/detect-object-injection
};

const findAll = async (req, res, model): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  let allDocs;
  try { allDocs = await model.findAll(); } catch (e) { return res.status(500).json({ message: (e as Error).message }); }
  return res.status(200).json(allDocs);
};

async function 
byId(model, req, res, method) {
  let item, uP;
  // eslint-disable-next-line security/detect-object-injection
  try { item = await model[method]({ where: { id: req.params.id } }); } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }
  if (method === 'destroy' && item > 0) return res.status(204).send();
  if (!item || item === 0) return res.status(400).json({ message: 'incorrect id' });
  try {
    item.set(req.body);
    uP = await item.save();
  } catch (e) {
    debug((e as Error).message);
    return res.status(500).json({ message: (e as Error).message });
  }
  return res.status(200).json(uP);
}

const remove = async (model, req, res): Promise<any> => {
  debug('findByIdAndRemove');
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  return byId(model, req, res, 'destroy');
};

const update = async (model, req, res): Promise<any> => {
  debug('findByIdAndUpdate');
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  return byId(model, req, res, 'findOne');
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
