const ErrorHandler = require("../utils/ErrorHandler");

exports.ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Wrong mongodb id
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT token
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid. Try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRED
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired. Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
