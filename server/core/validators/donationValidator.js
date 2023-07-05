const { body, param } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMW');

exports.validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Id must be Mongo ObjectID'),

  validatorMiddleware,
];

exports.validateAcceptDonation = [
  body('bloodGroup')
    .notEmpty()
    .withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Blood group must be either (A, B, AB, O) positive or negative'),

  body('bloodLifetime')
    .notEmpty()
    .withMessage('Blood lifetime is required')
    .isNumeric()
    .withMessage('Blood lifetime must be a number in days'),

  validatorMiddleware,
];

exports.validateRejectDonation = [
  body('rejectionReason')
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isString()
    .withMessage('Rejection reason must be a string'),

  validatorMiddleware,
];
