const express = require("express");
const db = require("../config/database");
const generateDailyPlan = require("../services/plannerEngine");

const router = express.Router();

router.get("/today", (req, res) => {
  const goals = db
    .prepare("SELECT * FROM goals")
    .all();

  const plan = generateDailyPlan(goals);

  res.status(200).json({
    success: true,
    data: {
      date: new Date().toISOString().split("T")[0],
      totalActiveGoals: plan.length,
      plan
    }
  });
});

module.exports = router;