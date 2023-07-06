const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env' });

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
})
  .then(() => {
    console.log('Seeding...');
  })
  .catch((error) => {
    console.log(error);
  });

const bloodRequestSeeder = require('./bloodRequestSeeder');
const citySeeder = require('./citySeeder');
const adminSeeder = require('./adminSeeder');
const hospitalSeeder = require('./hospitalSeeder');
const employeeSeeder = require('./employeeSeeder');
const donorSeeder = require('./donorSeeder');
const donationSeeder = require('./donationSeeder');
const stockSeeder = require('./stockSeeder');
const imageSeeder = require('./imageSeeder');
const pdfSeeder = require('./pdfSeeder');

(async () => {
  try {
    await bloodRequestSeeder();
    console.log('Blood Requests seeded successfully');

    await citySeeder();
    console.log('Cities seeded successfully');

    await adminSeeder();
    console.log('Admin seeded successfully');

    await hospitalSeeder();
    console.log('Hospitals seeded successfully');

    await employeeSeeder();
    console.log('Employees seeded successfully');

    await donorSeeder();
    console.log('Donors seeded successfully');

    await donationSeeder();
    console.log('Donations seeded successfully');

    await stockSeeder();
    console.log('Stock seeded successfully');

    await imageSeeder();
    console.log('Images seeded successfully');

    await pdfSeeder();
    console.log('PDFs seeded successfully');

    console.log('All seeding done');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
})();
