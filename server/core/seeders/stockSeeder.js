/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { generateRandomDate } = require('../utils/helper');
require('../../models/City');
require('../../models/Stock');

const CitySchema = mongoose.model('cities');
const StockSchema = mongoose.model('stock');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const seedStock = async () => {
  let data = await CitySchema.find({}, { _id: 1 });
  const cities = data.map((city) => city['_id'].toString());

  data = [];

  for (let i = 0; i < 50000; i++) {
    data.push({
      group: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      bloodBankCity: cities[Math.floor(Math.random() * cities.length)],
      expirationDate: generateRandomDate(35),
    });
  }

  await StockSchema.deleteMany({});
  await StockSchema.insertMany(data);
};

module.exports = seedStock;
