const mongoose = require('mongoose');

// Create BloodRequest Schema
const BloodRequestSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospitals',
    required: true,
  },
  group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  city: {
    type: String,
    required: true,
  },
  patientStatus: {
    type: String,
    enum: ['Immediate', 'Urgent', 'Normal'],
    default: 'Normal',
  },
  requestStatus: {
    type: String,
    enum: ['Pending', 'Delivering', 'Done', 'Failed'],
    default: 'Pending',
  },
  serveAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
  },
});

// Mapping Schema to Model
mongoose.model('bloodRequests', BloodRequestSchema);
