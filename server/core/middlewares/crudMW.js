const AsyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { toCapitalCase } = require('../utils/helper');

const paginatedResults = (data, request, key) => {
  let page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 10;

  const totalPages = Math.ceil(data.length / limit);
  if (page > totalPages) {
    page = totalPages;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  results[key] = data.slice(startIndex, endIndex);
  results.totalPages = totalPages;
  results.page = page;

  return results;
};

exports.getAllDocuments = (
  schema,
  key,
  projectObj = null,
  filterFunction = null,
  sortFunction = null,
  lookupArray = null,
  pagination = false,
) => AsyncHandler(async (request, response) => {
  const filterObj = filterFunction ? filterFunction(request) : null;
  const sortObj = sortFunction ? sortFunction(request) : null;

  const aggregateArray = [];
  if (lookupArray?.length > 0) {
    lookupArray.forEach((lookupObj) => {
      aggregateArray.push({ $lookup: lookupObj });
    });
  }
  if (projectObj) {
    aggregateArray.push({ $project: projectObj });
  }
  if (filterObj) {
    aggregateArray.push({ $match: filterObj });
  }
  if (sortObj) {
    aggregateArray.push({ $sort: sortObj });
  }
  const data = aggregateArray.length > 0
    ? await schema.aggregate(aggregateArray).exec() : await schema.find();

  if (pagination) {
    const results = paginatedResults(data, request, key);
    response.status(200).json({ results });
  } else {
    response.status(200).json({ results: data });
  }
});

exports.getDocumentById = (
  schema,
  key,
  matchFunction,
  projectObj,
) => AsyncHandler(async (request, response, next) => {
  const matchObj = matchFunction(request);
  const data = await schema.aggregate([
    { $match: matchObj },
    { $project: projectObj },
  ]).exec();

  console.log(data, request.params.id);
  if (data.length > 0) {
    return response.status(200).json({ [key]: data[0] });
  }
  return next(new ApiError(`${toCapitalCase(key)} not found`, 404));
});

exports.addDocument = (
  Schema,
  key,
  mapFunction,
  message,
) => AsyncHandler(async (request, response) => {
  const schemaObject = mapFunction(request);

  const data = await new Schema({ ...schemaObject });
  await data.save();

  const { _id, __v, ...result } = data.toObject();
  result.id = _id.toString();

  response.status(201).json({ [key]: result, status: 'success', message });
});
