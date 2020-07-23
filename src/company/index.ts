import express from 'express';
import controller from './CompanyController';
import commonUtils from '../commonUtils';

const router = express.Router();

router.route('/')
  .post((req, res) => controller.create(req, res))
  .get((req, res) => controller.find(req, res));
commonUtils.setIdRoutes(router, controller);

export default router;
