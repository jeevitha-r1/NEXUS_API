function calculateNextAction(goal) {
  if (goal.progress === 100) {
    return {
      nextAction: "Celebrate and create a new goal",
      urgency: "low",
      reason: "This goal is completed."
    };
  }

  if (goal.priority === "high" && goal.progress < 50) {
    return {
      nextAction: "Work on this goal today",
      urgency: "high",
      reason: "This is a high-priority goal with low progress."
    };
  }

  if (goal.progress >= 50) {
    return {
      nextAction: "Continue making progress",
      urgency: "medium",
      reason: "You are making good progress on this goal."
    };
  }

  return {
    nextAction: "Take the next step",
    urgency: "medium",
    reason: "This goal still needs progress."
  };
}

module.exports = calculateNextAction;