const express = require('express');
const donorController = require('../controllers/donorController');
const authorizationMW = require('../core/middlewares/authorizationMW');
const donorValidator = require('../core/validators/donorValidator');

const router = express.Router();

router
  .route('/register')
  .post(
    authorizationMW.employee,
    donorValidator.validatePostArray,
    donorController.registerDonor,
  );

module.exports = router;
