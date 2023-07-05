const express = require('express');
const stockController = require('../controllers/stockController');
const authorizationMW = require('../core/middlewares/authorizationMW');
const stockValidator = require('../core/validators/stockValidator');

const router = express.Router();

router
  .route('/request')
  .post(
    authorizationMW.hospital,
    stockValidator.validatePostArray,
    stockController.requestBlood,
  );

module.exports = router;
