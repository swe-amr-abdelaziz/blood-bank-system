const express = require('express');
const cityController = require('../controllers/cityController');
const cityValidator = require('../core/validators/cityValidator');

const router = express.Router();

router
  .route('/')
  .get(cityController.getAllCities);

router
  .route('/:id')
  .get(
    cityValidator.validateIdParam,
    cityController.getCityByName,
  );

router
  .route('/nearby/:city')
  .get(
    cityValidator.validateCityParam,
    cityController.getNearbyCities,
  );

module.exports = router;
