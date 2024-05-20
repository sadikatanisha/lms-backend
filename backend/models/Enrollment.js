const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const enrollmentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const enrollmentModel = model("Enrollment", enrollmentSchema);
module.exports = enrollmentModel;
