const CatchAsyncError = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

// Authenticated user
module.exports.isAuthenticated = CatchAsyncError(async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    console.log(req.cookies);
    if (!accessToken) {
      throw new ErrorHandler("Please login to access this resource", 400);
    }

    // Verify the token and extract the payload
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded.id);

    // Find the user by ID
    try {
      const user = await userModel.findById(decoded.id);
      console.log("found on auth:", user.id);
      console.log(req.user);
      req.user = user; //failed JSON.parse(user)
    } catch (err) {
      console.log("user not found");
    }

    if (!req.user) {
      throw new ErrorHandler("User not found", 404);
    }
    // console.log(error); error is not defined in this scope
    next();
  } catch (error) {
    console.log("authentication failed"); //error
    next(error);
  }
});

// Validate user role
module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
