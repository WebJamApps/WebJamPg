const debug = require('debug')('webjampg:CompanyController');
const model = require('./company.model');
const commonUtils = require('../commonUtils');

class CompanyController {
  constructor() {
    this.model = model;
    this.commonUtils = commonUtils;
  }

  async find(req, res) {
    return this.commonUtils.findAll(req, res, this.model);
  }

  async create(req, res) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'development') await this.model.sync();
    let newSchool;
    try {
      newSchool = await this.model.create(req.body);
    } catch (e) { debug(e.message); return res.status(500).json({ message: e.message }); }
    return res.status(201).json(newSchool);
  }

  findByIdAndUpdate(req, res) { return this.commonUtils.checkIdThen(req, res, 'update', this); }

  async findById(req, res) {
    let item;
    try { item = await this.model.findOne({ where: { id: req.params.id } }); } catch (e) {
      return res.status(500).json({ message: e.message });
    }
    if (!item) return res.status(400).json({ message: 'incorrect id' });
    return res.status(200).json(item);
  }

  update(req, res) { return this.commonUtils.update(this.model, req, res); }

  findByIdAndRemove(req, res) { return this.commonUtils.checkIdThen(req, res, 'remove', this); }

  remove(req, res) { return this.commonUtils.remove(this.model, req, res); }
}
module.exports = new CompanyController();
