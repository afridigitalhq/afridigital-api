const { getUser } = require('../../memory/memory.store');

function buildEconomyProfile(userId) {
  const mem = getUser(userId);

  const intents = mem.intents || [];

  const frequency = {};
  intents.forEach(i => {
    frequency[i.intent] = (frequency[i.intent] || 0) + 1;
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1]);

  const topIntent = sorted[0]?.[0] || null;

  return {
    topIntent,
    frequency,
    engagementScore: intents.length,
    lastIntent: intents.length ? intents[intents.length - 1].intent : null
  };
}

function rankMarketplaceItems(items = [], profile) {
  if (!profile) return items;

  return items
    .map(item => {
      let score = item.baseScore || 1;

      // 🧠 boost matching intent category
      if (item.category === profile.topIntent) {
        score += 50;
      }

      // 🔁 boost recurring interest
      if (profile.frequency[item.category]) {
        score += profile.frequency[item.category] * 10;
      }

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
}

function generateMonetizationHints(profile) {
  const hints = [];

  if (!profile) return hints;

  if (profile.engagementScore > 5) {
    hints.push({
      type: "BOOST_SUGGESTION",
      message: "Boost your visibility to get faster responses"
    });
  }

  if (profile.topIntent === "services") {
    hints.push({
      type: "SERVICE_PROMO",
      message: "Featured services available near you"
    });
  }

  if (profile.topIntent === "jobs") {
    hints.push({
      type: "JOB_BOOST",
      message: "Upgrade your profile for better job matches"
    });
  }

  return hints;
}

module.exports = {
  buildEconomyProfile,
  rankMarketplaceItems,
  generateMonetizationHints
};
