const express = require("express");
const goalRoutes = require("./routes/goalRoutes");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NEXUS API is running 🚀"
  });
});

// Goal routes
app.use("/api/goals", goalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`NEXUS API running at http://localhost:${PORT}`);
});