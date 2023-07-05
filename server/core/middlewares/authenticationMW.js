const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

module.exports = (request, response, next) => {
  try {
    const token = request.get('authorization').split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    request.decodedToken = decodedToken;
    next();
  } catch (error) {
    console.log(request.get('authorization'));
    next(new ApiError('U are not authenticated...!', 401));
  }
};
