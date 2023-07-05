const mongoose = require('mongoose');
const { generateFakeEmail } = require('../utils/helper');
require('../../models/Employee');
require('../../models/Hospital');

const EmployeeSchema = mongoose.model('employees');
const HospitalSchema = mongoose.model('hospitals');

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

const seedEmployees = async () => {
  let data = await HospitalSchema.find({}, { _id: 1 });
  // eslint-disable-next-line dot-notation
  const hospitals = data.map((hospital) => hospital['_id'].toString());
  data = [];

  for (let i = 0; i < names.length; i++) {
    data.push({
      firstName: names[i].split(' ')[0],
      lastName: names[i].split(' ')[1],
      email: generateFakeEmail(),
      password: '$2b$10$1UYG0QD84TNH25B1law6UesXHBUK7q4glGz4bDTZV0ub/UxDZWCE2',
      image: `employee_${i}.jpeg`,
      hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
      createdAt: Date.now(),
      verifiedAt: Date.now(),
    });
  }

  await EmployeeSchema.insertMany(data);
};

module.exports = seedEmployees;
