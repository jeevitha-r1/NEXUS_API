const calculateNextAction = require("../services/priorityEngine");
const express = require("express");
const goals = require("../data/goals");

const router = express.Router();

// GET all goals
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: goals.length,
    data: goals
  });
});

// POST a new goal
router.post("/", (req, res) => {
  const { title, category, priority, deadline, estimatedHours } = req.body;

  // Validate required fields
  if (!title || !category || !priority) {
    return res.status(400).json({
      success: false,
      error: "Title, category, and priority are required"
    });
  }

  // Validate priority
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: "Priority must be low, medium, or high"
    });
  }

const newGoal = {
  id: goals.length + 1,
  title: title.trim(),
  category: category.trim(),
  priority: priority.toLowerCase(),
  progress: 0,
  status: "not_started",
  deadline,
  estimatedHours: Number(estimatedHours) || 0
};

  goals.push(newGoal);

  res.status(201).json({
    success: true,
    message: "Goal created successfully",
    data: newGoal
  });
});

// GET a single goal by ID
// GET a single goal by ID
router.get("/:id", (req, res) => {
  const goalId = Number(req.params.id);

  const goal = goals.find((goal) => goal.id === goalId);

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

  const goalIndex = goals.findIndex((goal) => goal.id === goalId);

  if (goalIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Goal not found"
    });
  }

  const deletedGoal = goals.splice(goalIndex, 1);

  res.status(200).json({
    success: true,
    message: "Goal deleted successfully",
    data: deletedGoal[0]
  });
});


// UPDATE a goal by ID
router.put("/:id", (req, res) => {
  const goalId = Number(req.params.id);

  const goal = goals.find((goal) => goal.id === goalId);

  if (!goal) {
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

  // Validate required fields
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

  goal.title = title.trim();
  goal.category = category.trim();
  goal.priority = priority.toLowerCase();

  if (deadline !== undefined) {
  goal.deadline = deadline;
}

if (estimatedHours !== undefined) {
  goal.estimatedHours = Number(estimatedHours);
}

  if (progress !== undefined) {
  if (progress < 0 || progress > 100) {
    return res.status(400).json({
      success: false,
      error: "Progress must be between 0 and 100"
    });
  }

  goal.progress = progress;

  if (progress === 0) {
    goal.status = "not_started";
  } else if (progress === 100) {
    goal.status = "completed";
  } else {
    goal.status = "in_progress";
  }
}


  res.status(200).json({
    success: true,
    message: "Goal updated successfully",
    data: goal
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