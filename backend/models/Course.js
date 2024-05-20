require("dotenv").config();
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    public_id: String,
    url: String,
  },
  price: {
    type: Number,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
  adminFeedback: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "pending",
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  enrolledUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const courseModel = model("Course", courseSchema);
module.exports = courseModel;
