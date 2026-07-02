const { getState } = require("./interaction.tracker");

/**
 * Converts live interaction into priority weights
 */
function computeLiveWeights(userId) {

  const s = getState(userId);

  return {
    wallet: s.wallet || 0,
    jobs: s.jobs || 0,
    boost: s.boost || 0,
    earnings: s.earnings || 0,
    copilot: s.copilot || 0
  };
}

module.exports = { computeLiveWeights };
