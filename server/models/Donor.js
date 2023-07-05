const mongoose = require('mongoose');

// Create Donor Schema
const DonorSchema = new mongoose.Schema({
  nationalId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        const re = /^(2|3)\d{13}$/; // Accept valid national id, must be 14 digits and starts with either 2 or 3
        return !v || re.test(v);
      },
      message: 'Provided national id is invalid, must be 14 digits and starts with either 2 or 3',
    },
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const re = /^[\u0621-\u064A\u0660-\u0669a-zA-Z\-_\s]{3,50}$/; // Accept only English and Arabic letters
        return !v || re.test(v);
      },
      message: 'Provided name is invalid, only English or Arabic letters are allowed',
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
  sentMailAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
  },
});

// Mapping Schema to Model
mongoose.model('donors', DonorSchema);
