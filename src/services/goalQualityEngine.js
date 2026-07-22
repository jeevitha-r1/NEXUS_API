function analyzeGoalQuality(goal, allGoals) {
  const today = new Date();
  const deadline = goal.deadline
    ? new Date(goal.deadline)
    : null;

  const progress = Number(goal.progress) || 0;

  const isOverdue =
    deadline &&
    deadline < today &&
    progress < 100;

  const duplicateCount = allGoals.filter(
    (otherGoal) =>
      otherGoal.id !== goal.id &&
      otherGoal.title.trim().toLowerCase() ===
        goal.title.trim().toLowerCase()
  ).length;

  const isDuplicate = duplicateCount > 0;

  let riskLevel = "low";
  let riskReason = "This goal currently appears to be on track.";

  if (isOverdue) {
    riskLevel = "critical";
    riskReason = "The deadline has passed while the goal is incomplete.";
  } else if (isDuplicate) {
    riskLevel = "medium";
    riskReason = "A similar goal already exists.";
  } else if (progress < 50 && deadline) {
    const daysRemaining = Math.ceil(
      (deadline - today) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 7) {
      riskLevel = "high";
      riskReason =
        "The deadline is approaching while progress is still low.";
    } else {
      riskLevel = "medium";
      riskReason =
        "Significant work remains before the deadline.";
    }
  }

  return {
    isOverdue: Boolean(isOverdue),
    isDuplicate,
    duplicateCount,
    riskLevel,
    riskReason
  };
}

module.exports = analyzeGoalQuality;