const { getMetrics } = require("./metrics.collector");

/**
 * Analyze relationship between UI usage and marketplace outcomes
 */
function analyzeCoevolution() {

  const data = getMetrics();

  const uiEngagement = {};
  const marketplaceImpact = {};

  data.forEach(d => {

    if (d.type === "UI") {
      uiEngagement[d.widget] =
        (uiEngagement[d.widget] || 0) + (d.value || 1);
    }

    if (d.type === "MARKETPLACE") {
      marketplaceImpact[d.action] =
        (marketplaceImpact[d.action] || 0) + (d.value || 1);
    }
  });

  return {
    uiEngagement,
    marketplaceImpact
  };
}

module.exports = { analyzeCoevolution };
