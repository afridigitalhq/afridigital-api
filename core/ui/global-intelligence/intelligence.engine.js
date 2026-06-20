const { aggregateUIStats } = require("./aggregator");

/**
 * 🧠 Cross-user UI intelligence model
 */
function computeGlobalUIInsights() {

  const stats = aggregateUIStats();

  const insights = [];

  Object.entries(stats).forEach(([mode, data]) => {

    const engagementRate = data.engagement / (data.sessions || 1);
    const conversionRate = data.conversions / (data.sessions || 1);

    const score =
      (engagementRate * 0.6) +
      (conversionRate * 1.4);

    insights.push({
      mode,
      users: data.users.size,
      engagementRate,
      conversionRate,
      score
    });
  });

  return insights.sort((a, b) => b.score - a.score);
}

module.exports = { computeGlobalUIInsights };
