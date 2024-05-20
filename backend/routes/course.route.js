const express = require("express");
const {
  editCourse,
  uploadCourse,
  deleteCourse,
  getSingleCourse,
  getAllCourses,
  getUserCourses,
  updateCourseStatus,
  getApprovedCourses,
} = require("../controllers/course.controller");

const { authorizeRoles, isAuthenticated } = require("../middleware/auth");
// const { updateAccessToken } = require("../controllers/user.controller");

const courseRouter = express.Router();

// FOR INSTRUCTOR
courseRouter.post(
  "/create-course",
  isAuthenticated,

  authorizeRoles("instructor"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,

  authorizeRoles("instructor"),
  editCourse
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,

  authorizeRoles("instructor"),
  deleteCourse
);
courseRouter.get(
  "/my-courses",
  isAuthenticated,

  authorizeRoles("instructor"),
  getUserCourses
);

// FOR ADMIN
courseRouter.get(
  "/get-courses/",
  isAuthenticated,

  authorizeRoles("admin"),
  getAllCourses
);
courseRouter.put(
  "/update-course-status/:courseId",
  isAuthenticated,

  authorizeRoles("admin"),
  updateCourseStatus
);

//FOR USERS
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-approved-courses/", getApprovedCourses);

module.exports = courseRouter;
