const { computePreferences } = require("./pref.engine");
const { rankWidgets } = require("./ranker");

/**
 * Builds personalized dashboard layout per user
 */
function buildLayout(userId) {

  const weights = computePreferences(userId);

  const ranked = rankWidgets(weights);

  return {
    userId,
    layout: ranked,
    timestamp: Date.now()
  };
}

module.exports = { buildLayout };
