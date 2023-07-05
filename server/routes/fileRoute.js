const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router
  .route('/image/employee/:image')
  .get(fileController.getEmployeeImage);

router
  .route('/image/hospital/:image')
  .get(fileController.getHospitalImage);

module.exports = router;
