const courseModel = require("../models/Course");
const CatchAsyncError = require("../middleware/catchAsyncErrors");

// Create course
exports.createCourse = CatchAsyncError(async (data, res) => {
  const course = await courseModel.create(data);
  res.status(201).json({
    success: true,
    course,
  });
});
