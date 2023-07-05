const mongoose = require('mongoose');

// Create Stock Schema
const StockSchema = new mongoose.Schema({
  group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  bloodBankCity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cities',
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  hospitalRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospitals',
    default: null,
  },
});

// Mapping Schema to Model
mongoose.model('stock', StockSchema);
