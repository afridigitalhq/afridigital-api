const { executeAdjustment } = require("./adjustment.executor");

/**
 * Entry point from AI intelligence system
 */
function applyAIRecommendations(recommendations, marketplace) {

  const results = [];

  for (const action of recommendations) {

    const result = executeAdjustment(action, marketplace);

    results.push({
      action: action.type,
      result
    });
  }

  return results;
}

module.exports = { applyAIRecommendations };
