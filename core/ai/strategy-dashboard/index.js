/**
 * 🧠 AfriAI Strategy Dashboard (Admin Growth Planner UI)
 * Converts insights → structured growth plans
 */

const { getInsights } = require("../auto-optimization-engine");

/**
 * Generate structured growth strategy
 */
function generateStrategy() {

  const insights = getInsights();

  const plans = [];

  Object.entries(insights.recommendations || {}).forEach((rec, index) => {

    plans.push({
      id: index,
      title: `Growth Plan: ${rec[0]}`,
      focus: rec[1].action,
      steps: rec[1].suggestion,
      impactForecast: {
        demandIncrease: Math.random() * 40,
        earningsBoost: Math.random() * 25,
        riskLevel: "LOW"
      }
    });
  });

  return {
    generatedAt: Date.now(),
    totalPlans: plans.length,
    plans
  };
}

/**
 * ADMIN VIEW ONLY
 */
function getStrategyDashboard() {
  return generateStrategy();
}

module.exports = {
  getStrategyDashboard
};
