const { computeGlobalUIInsights } = require("./intelligence.engine");

/**
 * 🧠 Updates system-wide UI preferences
 */
function getGlobalBestUI() {

  const insights = computeGlobalUIInsights();

  if (!insights.length) {
    return {
      mode: "PERSONALIZED",
      reason: "NO_GLOBAL_DATA"
    };
  }

  const best = insights[0];

  return {
    mode: best.mode,
    score: best.score,
    usersAnalyzed: best.users,
    reason: "GLOBAL_OPTIMIZATION"
  };
}

module.exports = { getGlobalBestUI };
