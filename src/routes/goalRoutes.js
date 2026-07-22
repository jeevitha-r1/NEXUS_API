const express = require("express");
const db = require("../config/database");
const calculateNextAction = require("../services/priorityEngine");

const router = express.Router();
// GET all goals
router.get("/", (req, res) => {
  const goals = db
    .prepare("SELECT * FROM goals ORDER BY created_at DESC")
    .all();

  res.status(200).json({
    success: true,
    count: goals.length,
    data: goals
  });
});

// POST a new goal
router.post("/", (req, res) => {
  const {
    title,
    category,
    priority,
    deadline,
    estimatedHours
  } = req.body;

  if (!title || !category || !priority) {
    return res.status(400).json({
      success: false,
      error: "Title, category, and priority are required"
    });
  }

  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: "Priority must be low, medium, or high"
    });
  }

  const result = db
    .prepare(`
      INSERT INTO goals
      (title, category, priority, deadline, estimated_hours)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      title.trim(),
      category.trim(),
      priority.toLowerCase(),
      deadline || null,
      Number(estimatedHours) || 0
    );

  const newGoal = db
    .prepare("SELECT * FROM goals WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({
    success: true,
    message: "Goal created successfully",
    data: newGoal
  });
});

// GET a single goal by ID
router.get("/:id", (req, res) => {
  const goalId = Number(req.params.id);

  const goal = db
    .prepare("SELECT * FROM goals WHERE id = ?")
    .get(goalId);

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: "Goal not found"
    });
  }

  res.status(200).json({
    success: true,
    data: goal
  });
});

// DELETE a goal by ID
router.delete("/:id", (req, res) => {
  const goalId = Number(req.params.id);

  const goal = db
    .prepare("SELECT * FROM goals WHERE id = ?")
    .get(goalId);

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: "Goal not found"
    });
  }

  db.prepare("DELETE FROM goals WHERE id = ?").run(goalId);

  res.status(200).json({
    success: true,
    message: "Goal deleted successfully",
    data: goal
  });
});
// UPDATE a goal by ID
router.put("/:id", (req, res) => {
  const goalId = Number(req.params.id);

  const existingGoal = db
    .prepare("SELECT * FROM goals WHERE id = ?")
    .get(goalId);

  if (!existingGoal) {
    return res.status(404).json({
      success: false,
      error: "Goal not found"
    });
  }

  const {
    title,
    category,
    priority,
    progress,
    deadline,
    estimatedHours
  } = req.body;

  if (!title || !category || !priority) {
    return res.status(400).json({
      success: false,
      error: "Title, category, and priority are required"
    });
  }

  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: "Priority must be low, medium, or high"
    });
  }

  const updatedProgress =
    progress !== undefined ? Number(progress) : existingGoal.progress;

  if (updatedProgress < 0 || updatedProgress > 100) {
    return res.status(400).json({
      success: false,
      error: "Progress must be between 0 and 100"
    });
  }

  let updatedStatus = "not_started";

  if (updatedProgress > 0 && updatedProgress < 100) {
    updatedStatus = "in_progress";
  } else if (updatedProgress === 100) {
    updatedStatus = "completed";
  }

  db.prepare(`
    UPDATE goals
    SET
      title = ?,
      category = ?,
      priority = ?,
      progress = ?,
      status = ?,
      deadline = ?,
      estimated_hours = ?
    WHERE id = ?
  `).run(
    title.trim(),
    category.trim(),
    priority.toLowerCase(),
    updatedProgress,
    updatedStatus,
    deadline !== undefined ? deadline : existingGoal.deadline,
    estimatedHours !== undefined
      ? Number(estimatedHours)
      : existingGoal.estimated_hours,
    goalId
  );

  const updatedGoal = db
    .prepare("SELECT * FROM goals WHERE id = ?")
    .get(goalId);

  res.status(200).json({
    success: true,
    message: "Goal updated successfully",
    data: updatedGoal
  });
});

// Get the next best action for a goal
router.get("/:id/next-action", (req, res) => {
  const goalId = Number(req.params.id);

  const goal = goals.find((goal) => goal.id === goalId);

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: "Goal not found"
    });
  }

  const recommendation = calculateNextAction(goal);

  res.status(200).json({
    success: true,
    goal: goal.title,
    recommendation
  });
});

module.exports = router;