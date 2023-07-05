const sendErrForDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error,
    stack: error.stack,
    message: error.message,
  });
};

const sendErrForProd = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const globalError = (_error, request, response, next) => {
  const error = {};
  error.statusCode = _error.statusCode || 500;
  error.status = _error.status || 'error';
  error.message = _error.message || 'Something went wrong';
  error.stack = _error.stack || '';
  if (process.env.NODE_ENV === 'development') {
    sendErrForDev(error, response);
  } else {
    sendErrForProd(error, response);
  }
};

module.exports = globalError;
