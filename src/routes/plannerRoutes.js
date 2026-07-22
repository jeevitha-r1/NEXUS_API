const express = require("express");
const db = require("../config/database");
const generateDailyPlan = require("../services/plannerEngine");

const router = express.Router();

router.get("/today", (req, res) => {
  const availableHours = Number(req.query.hours) || 4;

  if (availableHours <= 0 || availableHours > 24) {
    return res.status(400).json({
      success: false,
      error: "Available hours must be between 1 and 24"
    });
  }

  const goals = db
    .prepare("SELECT * FROM goals")
    .all();

  const dailyPlan = generateDailyPlan(
    goals,
    availableHours
  );

  res.status(200).json({
    success: true,
    data: {
      date: new Date().toISOString().split("T")[0],
      totalActiveGoals: goals.filter(
        (goal) => goal.status !== "completed"
      ).length,
      ...dailyPlan
    }
  });
});

module.exports = router;