const { computeLiveWeights } = require("./realtime.pref");

/**
 * Dynamically reorders UI in real-time
 */
function morphLayout(userId, currentLayout) {

  const weights = computeLiveWeights(userId);

  const ranked = Object.entries(weights)
    .sort((a,b) => b[1] - a[1])
    .map(([k]) => k);

  const finalLayout = [];

  // ensure all widgets exist
  const base = ["copilot", "jobs", "wallet", "earnings", "boost"];

  ranked.forEach(w => finalLayout.push(w));

  base.forEach(w => {
    if (!finalLayout.includes(w)) finalLayout.push(w);
  });

  return {
    userId,
    layout: finalLayout,
    timestamp: Date.now(),
    reason: "REAL_TIME_MORPH"
  };
}

module.exports = { morphLayout };
