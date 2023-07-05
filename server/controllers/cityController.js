const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require('../models/City');

const CitySchema = mongoose.model('cities');
const crudMW = require('../core/middlewares/crudMW');
const cityAgg = require('../core/aggregation/cityAgg');

exports.getAllCities = crudMW.getAllDocuments(
  CitySchema,
  'cities',
  cityAgg.allCitiesProjection,
  null,
  cityAgg.sort,
);

exports.getCityByName = crudMW.getDocumentById(
  CitySchema,
  'city',
  (request) => ({ _id: new mongoose.Types.ObjectId(request.params.id) }),
  {
    _id: 0,
    id: '$_id',
    name: 1,
    location: 1,
  },
);

exports.getNearbyCities = asyncHandler(async (request, response) => {
  // Get coordinates of city
  const city = await CitySchema.findOne({ name: request.params.city });
  if (!city) {
    return response.status(404).json({
      status: 'error',
      message: 'City not found',
    });
  }
  const { coordinates } = city.location;

  const cities = await CitySchema.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates,
        },
        distanceField: 'distance',
        spherical: true,
        key: 'location.coordinates',
      },
    },
    {
      $addFields: {
        distance: { $divide: ['$distance', 1000] },
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        location: 1,
        distance: 1,
      },
    },
    {
      $sort: {
        distance: 1,
      },
    },
  ]);

  return response.status(200).json({
    status: 'success',
    cities,
  });
});
