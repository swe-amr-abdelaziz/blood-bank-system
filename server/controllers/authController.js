const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../core/utils/apiError');
require('../models/Employee');
require('../models/Hospital');

const EmployeeSchema = mongoose.model('employees');
const HospitalSchema = mongoose.model('hospitals');

const createToken = (payload) => jwt.sign({ payload }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

exports.employeeLogin = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeSchema.findOne({ email: req.body.email.toLowerCase() });
  if (!employee) {
    return next(new ApiError('Invalid credentials', 401));
  }

  if (await bcrypt.compare(req.body.password, employee.password)) {
    const role = employee.isAdmin ? process.env.ROLE_ADMIN : process.env.ROLE_EMPLOYEE;
    const { _id } = employee;
    const token = createToken({ role, id: _id });

    return res.status(200).json({
      message: 'Authenticated',
      token,
      role,
      image: employee.image,
    });
  }
  return next(new ApiError('Invalid credentials', 401));
});

exports.hospitalLogin = asyncHandler(async (req, res, next) => {
  const hospital = await HospitalSchema.findOne({ email: req.body.email.toLowerCase() });
  if (!hospital) {
    return next(new ApiError('Invalid credentials', 401));
  }

  if (await bcrypt.compare(req.body.password, hospital.password)) {
    const role = process.env.ROLE_HOSPITAL;
    const { _id } = hospital;
    const token = createToken({ role, id: _id });

    return res.status(200).json({
      message: 'Authenticated',
      token,
      role,
      image: 'defaultHospital.jpg',
    });
  }
  return next(new ApiError('Invalid credentials', 401));
});
