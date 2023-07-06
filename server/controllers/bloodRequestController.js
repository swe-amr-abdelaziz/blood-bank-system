/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { processBloodRequest } = require('./stockController');

require('../models/BloodRequest');

const BloodRequestSchema = mongoose.model('bloodRequests');

exports.servePendingBloodRequests = async () => {
  const bloodRequests = await BloodRequestSchema.find({ requestStatus: 'Pending' });
  bloodRequests.forEach(async (bloodRequest) => {
    setTimeout(async () => {
      const errorMessage = await processBloodRequest(bloodRequest);
      if (errorMessage) {
        await BloodRequestSchema.updateOne(
          {
            _id: bloodRequest['_id'],
          },
          {
            $set: {
              requestStatus: 'Failed',
              failedReason: errorMessage,
            },
          },
        );
      } else {
        await BloodRequestSchema.updateOne(
          {
            _id: bloodRequest['_id'],
          },
          {
            $set: {
              requestStatus: 'Delivering',
              failedReason: '',
            },
          },
        );
      }
    }, bloodRequest.serveAt - Date.now());
  });
};
