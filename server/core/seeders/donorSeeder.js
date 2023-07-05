const mongoose = require('mongoose');
const { generateFakeEmail, generateNationalId } = require('../utils/helper');
require('../../models/Donor');

const DonorSchema = mongoose.model('donors');

const names = [
  'Benjamin Anderson',
  'Matthew Thompson',
  'William Rodriguez',
  'James Campbell',
  'Alexander Wright',
  'Joseph Baker',
  'Daniel Lopez',
  'Michael Turner',
  'Ethan Adams',
  'David Mitchell',
  'Andrew Parker',
  'Christopher Morris',
  'Jacob Evans',
  'Joshua Rivera',
  'Anthony Collins',
  'Ryan Reed',
  'Nicholas Martinez',
  'Samuel Hughes',
  'Tyler Foster',
  'Jonathan Butler',
  'Brandon Simmons',
  'Jason Simmons',
  'Caleb Simmons',
  'Kevin Patterson',
  'Christian Powell',
  'Dylan Russell',
  'Aaron Jenkins',
  'Gabriel Sanchez',
  'Benjamin Coleman',
  'Mason Bryant',
  'Elijah Cox',
  'Caleb Bailey',
  'Daniel Reed',
  'Matthew Reed',
  'Isaac Howard',
  'Nathan Stewart',
  'Noah Price',
  'Luke Henderson',
  'John Reed',
  'Henry Reed',
  'Charles Butler',
  'Anthony Turner',
  'Christopher Fisher',
  'James Moore',
  'Michael Nelson',
  'Andrew Morgan',
  'David Wright',
  'Joseph Mitchell',
  'Thomas Adams',
  'William Baker',
];

const seedDonors = async () => {
  const data = [];

  for (let i = 0; i < names.length; i++) {
    data.push({
      nationalId: generateNationalId(),
      name: names[i],
      email: generateFakeEmail(),
      createdAt: Date.now(),
    });
  }

  await DonorSchema.deleteMany({});
  await DonorSchema.insertMany(data);
};

module.exports = seedDonors;
