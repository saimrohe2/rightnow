const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // Make sure dotenv knows where to find the .env file

// Import routes
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");

// Create the Express app
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://rightnowtest.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api", queryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/user", userRoutes);

// Export the app for Firebase
module.exports = app;
