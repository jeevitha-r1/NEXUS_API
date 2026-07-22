function analyzeGoal(goal) {
  const priorityWeights = {
    low: 1,
    medium: 2,
    high: 3
  };

  const priorityWeight = priorityWeights[goal.priority] || 1;

  const progress = Number(goal.progress) || 0;
  const estimatedHours = Number(goal.estimated_hours) || 0;

  const remainingHours =
    estimatedHours * (1 - progress / 100);

  let deadlinePressure = 0;

  if (goal.deadline) {
    const today = new Date();
    const deadline = new Date(goal.deadline);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysRemaining = Math.ceil(
      (deadline - today) / millisecondsPerDay
    );

    if (daysRemaining <= 0) {
      deadlinePressure = 40;
    } else if (daysRemaining <= 3) {
      deadlinePressure = 35;
    } else if (daysRemaining <= 7) {
      deadlinePressure = 25;
    } else if (daysRemaining <= 14) {
      deadlinePressure = 15;
    } else {
      deadlinePressure = 5;
    }
  }

  const priorityScore = priorityWeight * 15;

  const remainingWorkScore = Math.min(
    remainingHours * 2,
    30
  );

  const progressScore =
    progress === 0 ? 15 :
    progress < 50 ? 10 :
    progress < 100 ? 5 :
    0;

  const urgencyScore = Math.min(
    Math.round(
      priorityScore +
      deadlinePressure +
      remainingWorkScore +
      progressScore
    ),
    100
  );

  let urgencyLevel;
  let nextAction;
  let reason;

  if (urgencyScore >= 71) {
    urgencyLevel = "high";
    nextAction = "Work on this goal today";
    reason =
      "This goal requires immediate attention based on its priority, deadline, and remaining work.";
  } else if (urgencyScore >= 31) {
    urgencyLevel = "medium";
    nextAction = "Schedule time for this goal soon";
    reason =
      "This goal needs consistent progress to stay on track.";
  } else {
    urgencyLevel = "low";
    nextAction = "Continue at a steady pace";
    reason =
      "This goal currently has relatively low urgency.";
  }

  return {
    urgencyScore,
    urgencyLevel,
    remainingHours: Math.round(remainingHours * 10) / 10,
    nextAction,
    reason
  };
}

module.exports = analyzeGoal;