/**
 * 🔥 Admin Decision Heatmap Engine
 * Visual priority intelligence layer for execution decisions
 */

const { getRankedInsights } = require("../insight-ranking-engine");

/**
 * 🧠 Generate heatmap dataset
 */
function generateHeatmap() {

  const insights = getRankedInsights().ranked;

  return insights.map((item, index) => {

    const impact = item.impact || Math.random() * 100;
    const urgency = item.urgency || Math.random() * 100;

    return {
      id: index,
      label: item.recommendation,
      score: item.score,

      // Heatmap axes
      x: Math.round(impact),
      y: Math.round(urgency),

      // Color intensity
      intensity:
        item.score > 80
          ? "RED"
          : item.score > 50
          ? "YELLOW"
          : "GREEN"
    };
  });
}

/**
 * 📊 Heatmap data for admin UI
 */
function getHeatmapData() {

  const data = generateHeatmap();

  return {
    total: data.length,
    points: data
  };
}

module.exports = {
  getHeatmapData
};
