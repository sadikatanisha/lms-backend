const { redis } = require("../utils/redis");
const userModel = require("../models/User");

// Get user by id
exports.getUserById = async (id, res) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};
