/* eslint-disable dot-notation */
const mongoose = require('mongoose');
require('../models/BloodRequest');
require('../models/City');
require('../models/Stock');

const BloodRequestSchema = mongoose.model('bloodRequests');
const CitySchema = mongoose.model('cities');
const StockSchema = mongoose.model('stock');
const { generateRandomDate } = require('../core/utils/helper');

const getStockAmouts = async (bloodGroup) => StockSchema.aggregate([
  {
    $match: {
      group: bloodGroup,
      expirationDate: {
        $gte: new Date(Date.now()),
      },
      hospitalRequested: null,
    },
  },
  {
    $group: {
      _id: '$bloodBankCity',
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      id: '$_id',
      count: 1,
    },
  },
]).exec();

const getCoordinates = async (bloodBankCity) => {
  const city = await CitySchema.findOne({ name: bloodBankCity });
  if (!city) return null;
  return city.location.coordinates;
};

const getNearestCities = async (coordinates) => {
  const result = await CitySchema.aggregate([
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
      },
    },
    {
      $sort: {
        distance: 1,
      },
    },
  ]);

  return result.map((city) => city.id.toString());
};

const sortStockByNearest = (stock, cities) => {
  const customSort = (a, b) => {
    const indexA = cities.indexOf(a.id.toString());
    const indexB = cities.indexOf(b.id.toString());

    return indexA - indexB;
  };

  return stock.sort(customSort);
};

const getNearestCityWithSufficientStock = (stock, amount) => (
  stock.find((donation) => donation.count >= amount)
);

const sendBloodRequest = async (bloodRequest, targetCity) => {
  const result = await StockSchema.find({
    group: bloodRequest.group,
    bloodBankCity: targetCity.id,
    hospitalRequested: null,
  })
    .sort({ expirationDate: 1 })
    .limit(bloodRequest.amount);

  const recordIds = result.map((record) => record['_id']);

  await StockSchema.updateMany(
    { _id: { $in: recordIds } },
    { $set: { hospitalRequested: new mongoose.Types.ObjectId(bloodRequest.hospital) } },
  );
};

exports.processBloodRequest = async (bloodRequest) => {
  // Use transactions to avoid multiple requests to access shared resources at the same time
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get amounts of donations for a given blood group
    let stock = await getStockAmouts(bloodRequest.group);

    // Get coordinates of bloodBankCity
    const coordinates = await getCoordinates(bloodRequest.city);
    if (!coordinates) {
      return 'City not found';
    }

    // Get array of cities ids sorted by the nearest
    const cities = await getNearestCities(coordinates);

    // Sort donations array by nearest city by using sorted array of cities
    stock = sortStockByNearest(stock, cities);

    // Get first city that has sufficient number of donations
    const targetCity = getNearestCityWithSufficientStock(stock, bloodRequest.amount);
    if (!targetCity) {
      return 'There is no sufficient number of donations for this blood group';
    }

    // Request blood according to patient's status
    await sendBloodRequest(bloodRequest, targetCity);

    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    return console.error('Transaction aborted:', error);
  } finally {
    session.endSession();
  }
};

exports.requestBlood = async (request, response) => {
  /**
   * requestDate is used to delay request up to a specified amount of hours
   * based on patient's status
   */
  let requestDate;
  switch (request.body.patientStatus) {
    case 'Immediate':
      requestDate = generateRandomDate(
        parseInt(process.env.WAIT_TIME_IMMEDIATE, 10) / 24,
      );
      break;
    case 'Urgent':
      requestDate = generateRandomDate(
        parseInt(process.env.WAIT_TIME_URGENT, 10) / 24,
      );
      break;
    case 'Normal':
      requestDate = generateRandomDate(
        parseInt(process.env.WAIT_TIME_NORMAL, 10) / 24,
      );
      break;
    default:
      break;
  }

  // Save blood request to database
  const bloodRequest = await new BloodRequestSchema({
    hospital: request.decodedToken.payload.id,
    group: request.body.bloodGroup,
    amount: request.body.amount,
    city: request.body.bloodBankCity,
    patientStatus: request.body.patientStatus,
    serveAt: requestDate,
    createdAt: Date.now(),
  }).save();

  setTimeout(async () => {
    const errorMessage = await this.processBloodRequest(bloodRequest);
    if (errorMessage) {
      await BloodRequestSchema.updateOne(
        {
          _id: bloodRequest['_id'],
        },
        {
          $set: {
            requestStatus: 'Failed',
            failedReason: errorMessage,
          },
        },
      );
    }
    await BloodRequestSchema.updateOne(
      {
        _id: bloodRequest['_id'],
      },
      {
        $set: {
          requestStatus: 'Delivering',
          failedReason: '',
        },
      },
    );
  }, requestDate - new Date());

  return response.status(200).json({
    status: 'success',
    message: 'Blood request sent successfully',
  });
};
