const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require('../models/Donor');
require('../models/Donation');
require('../models/Stock');

const DonorSchema = mongoose.model('donors');
const DonationSchema = mongoose.model('donations');
const StockSchema = mongoose.model('stock');

const crudMW = require('../core/middlewares/crudMW');
const donationAgg = require('../core/aggregation/donationAgg');
const {
  emailAlreadySent,
  sendEmail,
  rejectionMail,
  acceptanceMail,
} = require('../core/utils/helper');

exports.getAllPendingDonations = crudMW.getAllDocuments(
  DonationSchema,
  'donations',
  donationAgg.allPendingDonationsProjection,
  donationAgg.filter,
  donationAgg.sort,
  donationAgg.lookupArray,
  true,
);

exports.acceptDonation = asyncHandler(async (request, response) => {
  const { bloodGroup, bloodLifetime } = request.body;
  const donation = await DonationSchema.findOne({ _id: request.params.id });
  if (!donation) {
    return response.status(404).json({
      status: 'error',
      message: 'Donation not found',
    });
  }

  if (donation.status !== 'Pending') {
    return response.status(200).json({
      status: 'success',
      message: `Donation Already ${donation.status}`,
    });
  }

  const donor = await DonorSchema.findOne({ _id: donation.donor });
  if (!donor) {
    return response.status(404).json({
      status: 'error',
      message: 'Donor not found',
    });
  }

  const expirationDate = new Date(donation.createdAt);
  expirationDate.setDate(expirationDate.getDate() + parseInt(bloodLifetime, 10));

  // Accept donation
  await DonationSchema.updateOne({ _id: request.params.id }, {
    $set: {
      status: 'Accepted',
    },
  });

  // Add donation to stock
  await new StockSchema({
    group: bloodGroup,
    bloodBankCity: donation.city,
    expirationDate,
  }).save();

  if (donation.status === 'Pending' || (donation.status !== 'Pending' && !emailAlreadySent(new Date(donor.sentMailAt)))) {
    sendEmail({
      email: donor.email,
      subject: 'Donation Accepted',
      message: acceptanceMail(donor.name),
    })
      .then(async () => {
        await DonorSchema.updateOne({ _id: donation.donor }, {
          sentMailAt: Date.now(),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return response.status(200).json({
    status: 'success',
    message: 'Donation accepted and added to stock successfully',
  });
});

exports.rejectDonation = asyncHandler(async (request, response) => {
  const donation = await DonationSchema.findOne({ _id: request.params.id });
  if (!donation) {
    return response.status(404).json({
      status: 'error',
      message: 'Donation not found',
    });
  }

  if (donation.status !== 'Pending') {
    return response.status(200).json({
      status: 'success',
      message: `Donation Already ${donation.status}`,
    });
  }

  const donor = await DonorSchema.findOne({ _id: donation.donor });
  if (!donor) {
    return response.status(404).json({
      status: 'error',
      message: 'Donor not found',
    });
  }

  await DonationSchema.updateOne({ _id: request.params.id }, {
    $set: {
      status: 'Rejected',
      rejectionReason: request.body.rejectionReason,
    },
  });

  if (donation.status === 'Pending' || (donation.status !== 'Pending' && !emailAlreadySent(new Date(donor.sentMailAt)))) {
    sendEmail({
      email: donor.email,
      subject: 'Donation Rejected',
      message: rejectionMail(donor.name, request.body.rejectionReason),
    })
      .then(async () => {
        await DonorSchema.updateOne({ _id: donation.donor }, {
          sentMailAt: Date.now(),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return response.status(200).json({
    status: 'success',
    message: 'Donation rejected successfully',
  });
});
