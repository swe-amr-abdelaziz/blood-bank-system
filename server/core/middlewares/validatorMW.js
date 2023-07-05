const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationError = true;
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

module.exports = validatorMiddleware;
