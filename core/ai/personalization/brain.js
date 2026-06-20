const { buildEconomyProfile } = require('../economy/brain');
const { getUser } = require('../../memory/memory.store');

function buildProfile(userId) {
  const mem = getUser(userId);

  const intents = mem.intents || [];

  const frequencyMap = intents.reduce((acc, i) => {
    acc[i.intent] = (acc[i.intent] || 0) + 1;
    return acc;
  }, {});

  const topIntent = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    topIntent: topIntent ? topIntent[0] : null,
    frequencyMap,
    lastIntent: intents.length ? intents[intents.length - 1].intent : null
  };
}

function personalizeRoute(route, profile) {
  if (!profile || !profile.topIntent) return route;

  // 🔥 boost frequent usage paths
  if (route.includes(profile.topIntent)) {
    return route + "_PRIORITY";
  }

  // 🧠 fallback bias
  if (profile.lastIntent && route.includes(profile.lastIntent)) {
    return route + "_RECENT";
  }

  return route;
}

function personalizeResponse(response, profile) {
  if (!profile) return response;

  return {
    ...response,
    personalization: {
      preferredDomain: profile.topIntent,
      optimized: true
    }
  };
}

module.exports = {
  buildProfile,
  personalizeRoute,
  personalizeResponse
};
