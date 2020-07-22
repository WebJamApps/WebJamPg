const express = require('express');

const router = express.Router();

const controller = require('./UserController');

router.route('/')
  .post((...args) => controller.create(...args))
  .get((...args) => controller.getUsers(...args));
router.route('/:id')
  .put((...args) => controller.updateUser(...args))
  .delete((...args) => controller.deleteUser(...args));
router.route('/pincode')
  .post((...args) => controller.checkPin(...args));
router.route('/login')
  .post((...args) => controller.loginUser(...args));

module.exports = router;
