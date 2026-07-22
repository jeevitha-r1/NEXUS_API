const analyzeGoal = require("./intelligenceEngine");

function generateDailyPlan(goals) {
  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed"
  );

  const analyzedGoals = activeGoals.map((goal) => {
    const analysis = analyzeGoal(goal);

    const remainingHours =
      Number(analysis.remainingHours) || 0;

    const recommendedTime = Math.min(
      Math.max(Math.ceil(remainingHours * 0.25), 0.5),
      2
    );

    return {
      goalId: goal.id,
      goal: goal.title,
      urgencyScore: analysis.urgencyScore,
      urgencyLevel: analysis.urgencyLevel,
      recommendedTime,
      nextAction: analysis.nextAction,
      reason: analysis.reason
    };
  });

  analyzedGoals.sort(
    (a, b) => b.urgencyScore - a.urgencyScore
  );

  const rankedPlan = analyzedGoals.map((goal, index) => ({
    rank: index + 1,
    ...goal
  }));

  return rankedPlan;
}

module.exports = generateDailyPlan;