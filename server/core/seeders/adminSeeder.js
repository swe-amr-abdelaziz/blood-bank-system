const mongoose = require('mongoose');
require('../../models/Employee');

const EmployeeSchema = mongoose.model('employees');

const seedAdmin = async () => {
  await EmployeeSchema.deleteMany({});
  await EmployeeSchema.insertMany([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@admin.com',
      password: '$2b$10$1UYG0QD84TNH25B1law6UesXHBUK7q4glGz4bDTZV0ub/UxDZWCE2',
      image: 'admin.jpeg',
      hospital: null,
      isAdmin: true,
      createdAt: Date.now(),
      verifiedAt: Date.now(),
    },
  ]);
};

module.exports = seedAdmin;
