const { analyzeCoevolution } = require("./analyzer");

/**
 * Generates recommendations ONLY (no execution)
 */
function generateInsights() {

  const { uiEngagement, marketplaceImpact } = analyzeCoevolution();

  const insights = [];

  Object.keys(uiEngagement).forEach(widget => {

    const uiScore = uiEngagement[widget] || 0;

    const relatedMarketImpact =
      marketplaceImpact[widget] || 0;

    insights.push({
      widget,
      uiScore,
      marketImpact: relatedMarketImpact,
      suggestion:
        uiScore > 50
          ? "Keep widget prominent"
          : "Consider repositioning or redesign"
    });
  });

  return insights;
}

module.exports = { generateInsights };
