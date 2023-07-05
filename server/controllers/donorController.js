/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const {
  addMonths,
  sendEmail,
  emailAlreadySent,
  pendingMail,
  rejectionMailThreeMonths,
} = require('../core/utils/helper');
require('../models/Donor');
require('../models/Donation');

const DonorSchema = mongoose.model('donors');
const DonationSchema = mongoose.model('donations');

exports.registerDonor = asyncHandler(async (request, response) => {
  let donor = await DonorSchema.findOne({ nationalId: request.body.nationalId });

  if (donor) {
    const donations = await DonationSchema.aggregate([
      { $match: { donor: new mongoose.Types.ObjectId(donor['_id']) } },
      { $sort: { createdAt: -1 } },
    ]).exec();
    const [donation] = donations;

    // Update donor if already exists
    await DonorSchema.updateOne({ nationalId: request.body.nationalId }, {
      name: request.body.name,
      email: request.body.email,
    });

    if (donation && Date.now() <= addMonths(donation.createdAt, 3)) {
      if (donation.status === 'Pending') {
        return response.status(200).json({
          status: 'info',
          message: 'Your donation is pending for virus checks',
        });
      }

      if (!donor.sentMailAt || !emailAlreadySent(new Date(donor.sentMailAt))) {
        sendEmail({
          email: donor.email,
          subject: 'Donation Rejected',
          message: rejectionMailThreeMonths(donor.name, donation.createdAt),
        })
          .then(async () => {
            await DonorSchema.updateOne({ nationalId: request.body.nationalId }, {
              sentMailAt: Date.now(),
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      return response.status(400).json({
        status: 'error',
        message: 'You must wait at least 3 months since your last donation before you can donate again',
      });
    }

    response.status(200).json({
      status: 'success',
      message: 'Donor updated successfully',
    });
  } else {
    // Create new donor
    donor = await new DonorSchema({
      nationalId: request.body.nationalId,
      name: request.body.name,
      email: request.body.email,
      createdAt: Date.now(),
    }).save();
  }

  // Create new donation
  await new DonationSchema({
    donor: donor['_id'].toString(),
    city: request.body.city,
    createdAt: Date.now(),
  }).save();

  if (!donor.sentMailAt || !emailAlreadySent(new Date(donor.sentMailAt))) {
    sendEmail({
      email: donor.email,
      subject: 'Donation Pending - Virus Review in Progress',
      message: pendingMail(donor.name),
    })
      .then(async () => {
        await DonorSchema.updateOne({ nationalId: request.body.nationalId }, {
          sentMailAt: Date.now(),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return response.status(201).json({
    status: 'success',
    message: 'Donor registered successfully',
  });
});
