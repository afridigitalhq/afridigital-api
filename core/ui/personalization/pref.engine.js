const { getBehavior } = require("./behavior.tracker");

/**
 * Converts behavior into weighted preferences
 */
function computePreferences(userId) {

  const behavior = getBehavior(userId);

  const weights = {
    wallet: behavior.wallet || 0,
    jobs: behavior.jobs || 0,
    boost: behavior.boost || 0,
    earnings: behavior.earnings || 0,
    copilot: behavior.copilot || 0
  };

  return weights;
}

module.exports = { computePreferences };
