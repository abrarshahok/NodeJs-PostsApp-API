const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Authorization header missing");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, "secrettoken");
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    err.statusCode = err.name === "JsonWebTokenError" ? 401 : 500;
    return next(err);
  }
};
