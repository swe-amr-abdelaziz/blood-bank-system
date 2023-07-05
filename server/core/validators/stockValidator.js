const { body } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMW');

exports.validatePostArray = [
  body('bloodGroup')
    .notEmpty()
    .withMessage('bloodGroup is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('bloodGroup must be either (A, B, AB, O) positive or negative'),

  body('bloodBankCity')
    .notEmpty()
    .withMessage('bloodBankCity lifetime is required')
    .isString()
    .withMessage('bloodBankCity must be a string'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (value < 1) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),

  body('patientStatus')
    .isIn(['Immediate', 'Urgent', 'Normal'])
    .withMessage('patientStatus must be either (Immediate, Urgent, Normal)'),

  validatorMiddleware,
];
