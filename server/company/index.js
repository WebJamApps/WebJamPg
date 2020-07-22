const router = require('express').Router();

const controller = require('./CompanyController');
const commonUtils = require('../commonUtils');

router.route('/')
  .post((...args) => controller.create(...args))
  .get((...args) => controller.find(...args));
commonUtils.setIdRoutes(router, controller);

module.exports = router;
