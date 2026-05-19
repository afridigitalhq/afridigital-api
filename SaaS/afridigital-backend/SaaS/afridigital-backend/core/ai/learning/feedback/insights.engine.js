/**
 * 🔁 A3.18.11 FEEDBACK INSIGHT ENGINE
 * Generates improvement suggestions ONLY (no execution)
 */

function generateInsights(metrics) {

  const insights = [];

  if (metrics.lowEngagement) {
    insights.push({
      type: "ENGAGEMENT",
      suggestion: "Simplify AI response structure",
      confidence: 0.7
    });
  }

  if (metrics.highLatency) {
    insights.push({
      type: "PERFORMANCE",
      suggestion: "Optimize AI response pipeline",
      confidence: 0.8
    });
  }

  return insights;
}

module.exports = { generateInsights };
