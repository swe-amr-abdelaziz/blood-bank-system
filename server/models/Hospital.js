const mongoose = require('mongoose');

// Create Hospital Schema
const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  legalPapers: {
    type: String,
    required: true,
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
mongoose.model('hospitals', HospitalSchema);
