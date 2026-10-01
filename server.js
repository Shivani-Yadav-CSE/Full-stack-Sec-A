require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Connect to MongoDB (skipped automatically when required from tests - see tests/setup)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically is intentionally NOT exposed here -
// downloads go through the authenticated /api/resources/:id/download route instead.

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "CampusConnect API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`CampusConnect API listening on port ${PORT}`);
  });
}

module.exports = app; // exported for supertest
