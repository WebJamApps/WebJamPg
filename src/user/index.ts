import express from 'express';
import controller from './UserController';

const router = express.Router();
router.route('/')
  .post((req, res) => controller.create(req, res))
  .get((req, res) => controller.getUsers(req, res));
router.route('/:id')
  .put((req, res) => controller.updateUser(req, res))
  .delete((req, res) => controller.deleteUser(req, res));
router.route('/pincode')
  .post((req, res) => controller.checkPin(req, res));
router.route('/login')
  .post((req, res) => controller.loginUser(req, res));

export default router;
