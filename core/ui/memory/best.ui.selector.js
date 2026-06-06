const { rankModes } = require("./scoring.engine");
const { getUserMemory } = require("./performance.tracker");

/**
 * 🧠 Learns best performing UI mode per user
 */
function getBestUIMode(userId) {

  const memory = getUserMemory(userId);

  const ranked = rankModes(memory);

  if (!ranked.length) {
    return {
      mode: "PERSONALIZED",
      reason: "NO_HISTORY"
    };
  }

  const best = ranked[0];

  return {
    mode: best.mode,
    score: best.score,
    reason: "LEARNED_OPTIMIZATION"
  };
}

module.exports = { getBestUIMode };
