const { body } = require('express-validator');
const mongoose = require('mongoose');
const validatorMiddleware = require('../middlewares/validatorMW');
const ApiError = require('../utils/apiError');
require('../../models/Donor');

const DonorSchema = mongoose.model('donors');

exports.validatePostArray = [
  body('nationalId')
    .notEmpty()
    .withMessage('National id is required')
    .matches(/^(2|3)\d{13}$/)
    .withMessage('National id is invalid, must be 14 digits and starts with either 2 or 3'),

  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[\u0621-\u064A\u0660-\u0669a-zA-Z\-_\s]{3,50}$/)
    .withMessage('Name is invalid, only English or Arabic letters are allowed'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),

  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City Must Be String'),

  validatorMiddleware,
];
