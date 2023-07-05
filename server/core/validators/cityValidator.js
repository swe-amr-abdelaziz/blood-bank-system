const { param } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMW');

exports.validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Id must be a valid mongoId'),

  validatorMiddleware,
];

exports.validateCityParam = [
  param('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City Must Be String'),

  validatorMiddleware,
];
