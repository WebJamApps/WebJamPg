const debug = require('debug')('webjampg:commonUtils');

exports.checkIdThen = (req, res, func, controller) => {
  if (req.params.id === null || req.params.id === undefined) return res.status(400).json({ message: 'id is required' });
  return controller[func](req, res);// eslint-disable-line security/detect-object-injection
};

exports.findAll = async (req, res, model) => {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') await model.sync();
  let allDocs;
  try { allDocs = await model.findAll(); } catch (e) { return res.status(500).json({ message: e.message }); }
  return res.status(200).json(allDocs);
};

exports.remove = async (model, req, res) => {
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

exports.update = async (model, req, res) => {
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

exports.setIdRoutes = (router, controller) => {
  router.route('/:id')
    .put((...args) => controller.findByIdAndUpdate(...args))
    .delete((...args) => controller.findByIdAndRemove(...args))
    .get((...args) => controller.findById(...args));
};
