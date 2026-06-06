const { extractSignals } = require("./profile.signals");

function computePreferences(user) {

  const s = extractSignals(user);

  return {
    wallet: s.walletActivity,
    jobs: s.jobActivity,
    boost: s.boostActivity,
    earnings: s.earningsActivity,
    copilot: s.copilotUsage
  };
}

module.exports = { computePreferences };
