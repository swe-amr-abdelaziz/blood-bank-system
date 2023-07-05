const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../core/validators/authValidator');

const router = express.Router();

router
  .route('/employee/login')
  .post(
    authValidator.loginValidator,
    authController.employeeLogin,
  );

router
  .route('/hospital/login')
  .post(
    authValidator.loginValidator,
    authController.hospitalLogin,
  );

module.exports = router;
