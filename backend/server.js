require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");
const { ErrorMiddleware } = require("./middleware/error");
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const app = express();
const PORT = process.env.PORT || 3000;
//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// CORS
app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());
//SERVER

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});

// Body parser
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// 404 Error handling
app.all("*", (req, res, next) => {
  const err = new Error(`Route to ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Error middleware
app.use(ErrorMiddleware);
