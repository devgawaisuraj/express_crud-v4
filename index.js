require("dotenv").config();

const express = require("express");
const cors = require("cors");

const studentRoutes = require("./app/routes/student.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check - does not require MySQL
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API is running on Vercel 🚀",
  });
});

// Student CRUD routes
app.use("/api/students", studentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Export Express app for Vercel
module.exports = app;

// Start server only for local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}
