const mongoose = require('mongoose');
require('../../models/Hospital');

const HospitalSchema = mongoose.model('hospitals');

const cities = [
  'Alexandria',
  'Cairo',
  'Damietta',
  'Giza',
  'Ismailia',
  'Suez',
];

const seedHospitals = async () => {
  const data = [];

  for (let i = 0; i < cities.length; i++) {
    data.push({
      name: `${cities[i]} Hospital`,
      email: `${cities[i].toLowerCase()}@hospital.com`,
      password: '$2b$10$1UYG0QD84TNH25B1law6UesXHBUK7q4glGz4bDTZV0ub/UxDZWCE2',
      legalPapers: `${i}.pdf`,
      createdAt: Date.now(),
      verifiedAt: Date.now(),
    });
  }

  await HospitalSchema.deleteMany({});
  await HospitalSchema.insertMany(data);
};

module.exports = seedHospitals;
