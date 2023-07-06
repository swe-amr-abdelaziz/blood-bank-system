const mongoose = require('mongoose');
require('../../models/BloodRequest');

const BloodRequestSchema = mongoose.model('bloodRequests');

const seedBloodRequests = async () => {
  await BloodRequestSchema.deleteMany({});
};

module.exports = seedBloodRequests;
