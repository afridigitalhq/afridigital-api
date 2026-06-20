const { computePreferences } = require("./preferences");
const { rankWidgets } = require("./ranker");

function buildDashboard(user) {

  const prefs = computePreferences(user);

  const ranked = rankWidgets(prefs);

  const base = ["copilot", "jobs", "wallet", "earnings", "boost"];

  const layout = [...ranked];

  base.forEach(w => {
    if (!layout.includes(w)) layout.push(w);
  });

  return {
    userId: user.id,
    layout,
    mode: "PERSONALIZED",
    timestamp: Date.now()
  };
}

module.exports = { buildDashboard };
