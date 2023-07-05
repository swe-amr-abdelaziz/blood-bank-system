const ApiError = require('../utils/apiError');

exports.admin = (req, res, next) => {
  if (req.decodedToken.payload.role === process.env.ROLE_ADMIN) {
    next();
  } else {
    next(new ApiError('UnAuthorized..!', 403));
  }
};

exports.employee = (req, res, next) => {
  if (req.decodedToken.payload.role === process.env.ROLE_EMPLOYEE) {
    next();
  } else {
    next(new ApiError('UnAuthorized..!', 403));
  }
};

exports.hospital = (req, res, next) => {
  if (req.decodedToken.payload.role === process.env.ROLE_HOSPITAL) {
    next();
  } else {
    next(new ApiError('UnAuthorized..!', 403));
  }
};
