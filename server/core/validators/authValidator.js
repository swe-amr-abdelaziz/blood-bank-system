const { body } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMW');

exports.loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid, eg. "example@xyz.com"'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validatorMiddleware,
];
