require("dotenv").config();
const CatchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const { createCourse } = require("../services/course.service");
const courseModel = require("../models/Course");
const userModel = require("../models/User");
// Upload course
const uploadCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;

    if (image) {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "courses",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    data.instructor = req.user._id;
    createCourse(data, res, next);
  } catch (error) {
    // Properly handle errors
    return next(new ErrorHandler(error.message, 500));
  }
});

// Edit Course
const editCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;

    if (image) {
      // Delete the old image from Cloudinary
      await cloudinary.v2.uploader.destroy(image.public_id);

      // Upload the new image to Cloudinary
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "courses",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const courseId = req.params.id;
    // Update the course details in the database
    const course = await courseModel.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    // Properly handle errors
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete Course
const deleteCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Delete the course image from Cloudinary
    if (course.image && course.image.public_id) {
      await cloudinary.v2.uploader.destroy(course.image.public_id);
    }

    // Delete the course from the database
    await courseModel.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    // Properly handle errors
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Single Course
const getSingleCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.id);

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get all courses (ADMIN)
const getAllCourses = CatchAsyncError(async (req, res, next) => {
  try {
    const courses = await courseModel
      .find()
      .select("name status adminFeedback image")
      .populate("instructor", "email"); // Populate instructor with only email field

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get User Courses
const getUserCourses = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courses = await courseModel.find({ instructor: userId });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Update Course status (ADMIN ONLY)
const updateCourseStatus = CatchAsyncError(async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { status, adminFeedback } = req.body;

    const course = await courseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    course.status = status;
    if (adminFeedback) {
      course.adminFeedback = adminFeedback;
    }
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course status updated to ${status} successfully`,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Approved Courses
const getApprovedCourses = CatchAsyncError(async (req, res, next) => {
  try {
    const courses = await courseModel.find({ status: "approved" });
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Add  course to cart
const addToCart = CatchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const courseId = req.body.courseId;

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.cart.includes(courseId)) {
    return next(new ErrorHandler("Course already in cart", 400));
  }

  user.selectedCourses.push(courseId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Course added to cart",
  });
});

module.exports = {
  uploadCourse,
  editCourse,
  deleteCourse,
  getSingleCourse,
  getAllCourses,
  getUserCourses,
  updateCourseStatus,
  getApprovedCourses,
  addToCart,
};
