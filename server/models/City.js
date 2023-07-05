const mongoose = require('mongoose');

// Create City Schema
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
});

// Mapping Schema to Model
mongoose.model('cities', CitySchema);
