const mongoose = require('mongoose');

// Create Employee Schema
const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const re = /^([\u0621-\u064A\u0660-\u0669\s]{3,50}|[a-zA-Z\s]{3,50})$/; // Accept valid firstName
        return !v || re.test(v);
      },
      message: 'Provided first name is invalid, only English or Arabic letters are allowed',
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const re = /^([\u0621-\u064A\u0660-\u0669\s]{3,50}|[a-zA-Z\s]{3,50})$/; // Accept valid lastName
        return !v || re.test(v);
      },
      message: 'Provided last name is invalid, only English or Arabic letters are allowed',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/; // Accept valid email
        return !v || re.test(v);
      },
      message: 'Provided email is invalid',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/; // Accept valid password
        return !v || re.test(v);
      },
      message: 'Provided password is invalid, must be at least 8 characters length, and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  },
  image: {
    type: String,
    default: 'defaultEmployee.jpg',
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospitals',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
});

// Mapping Schema to Model
mongoose.model('employees', EmployeeSchema);
