const { validationResult } = require("express-validator");

const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = { validationResultHandler };
