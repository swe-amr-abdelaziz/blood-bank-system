/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { generateRandomDate } = require('../utils/helper');
require('../../models/City');
require('../../models/Donor');
require('../../models/Donation');

const CitySchema = mongoose.model('cities');
const DonorSchema = mongoose.model('donors');
const DonationSchema = mongoose.model('donations');

const seedDonations = async () => {
  let data = await CitySchema.find({}, { _id: 1 });
  const cities = data.map((city) => city['_id'].toString());

  data = await DonorSchema.find({}, { _id: 1 });
  const donors = data.map((donor) => donor['_id'].toString());

  data = [];

  for (let i = 0; i < donors.length; i++) {
    data.push({
      city: cities[Math.floor(Math.random() * cities.length)],
      donor: donors[i],
      status: 'Pending',
      createdAt: generateRandomDate(-30),
    });
  }

  await DonationSchema.deleteMany({});
  await DonationSchema.insertMany(data);
};

module.exports = seedDonations;
