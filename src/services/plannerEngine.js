const analyzeGoal = require("./intelligenceEngine");
const analyzeGoalQuality = require("./goalQualityEngine");

function generateDailyPlan(goals, availableHours = 4) {
  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed"
  );

  const analyzedGoals = activeGoals.map((goal) => {
    const analysis = analyzeGoal(goal);
    const quality = analyzeGoalQuality(goal, goals);

    return {
      goalId: goal.id,
      goal: goal.title,
      urgencyScore: analysis.urgencyScore,
      urgencyLevel: analysis.urgencyLevel,
      remainingHours: analysis.remainingHours,
      riskLevel: quality.riskLevel,
      isOverdue: quality.isOverdue,
      isDuplicate: quality.isDuplicate,
      nextAction: analysis.nextAction,
      reason: analysis.reason
    };
  });

  analyzedGoals.sort((a, b) => {
  const riskWeights = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  const riskDifference =
    riskWeights[b.riskLevel] -
    riskWeights[a.riskLevel];

  if (riskDifference !== 0) {
    return riskDifference;
  }

  return b.urgencyScore - a.urgencyScore;
});
  let remainingTime = availableHours;

  const plan = [];
  const deferred = [];

  for (const goal of analyzedGoals) {
    if (remainingTime <= 0) {
      deferred.push({
        goalId: goal.goalId,
        goal: goal.goal,
        reason: "Not enough time available today"
      });
      continue;
    }

    const allocatedTime = Math.min(
      goal.remainingHours,
      remainingTime,
      2
    );

    if (allocatedTime > 0) {
      plan.push({
        rank: plan.length + 1,
        goalId: goal.goalId,
        goal: goal.goal,
        urgencyScore: goal.urgencyScore,
        urgencyLevel: goal.urgencyLevel,
        riskLevel: goal.riskLevel,
        isOverdue: goal.isOverdue,
        isDuplicate: goal.isDuplicate,
        allocatedHours: Math.round(allocatedTime * 10) / 10,
        nextAction: goal.nextAction,
        reason: goal.reason
      });

      remainingTime -= allocatedTime;
    }
  }

  return {
    availableHours,
    allocatedHours:
      Math.round((availableHours - remainingTime) * 10) / 10,
    remainingUnallocatedHours:
      Math.round(remainingTime * 10) / 10,
    plan,
    deferred
  };
}

module.exports = generateDailyPlan;