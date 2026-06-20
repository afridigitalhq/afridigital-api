/**
 * 🔥 Autonomous Insight Ranking Engine
 * (AI Recommendation Scoring + Prioritization Layer)
 */

const bus = require("../../eventbus");

/**
 * 📊 Store incoming AI insights
 */
const insightsPool = [];

/**
 * 🧠 Receive multi-agent insights
 */
function collectInsights(agentOutput) {

  Object.values(agentOutput).forEach(agent => {

    if (!agent || !agent.insight) return;

    insightsPool.push({
      text: agent.insight,
      type: agent.type,
      raw: agent
    });
  });
}

/**
 * 📈 Scoring system
 */
function scoreInsight(insight) {

  const impact = Math.random() * 100;     // placeholder model
  const urgency = Math.random() * 100;
  const confidence = 60 + Math.random() * 40;

  const score =
    (impact * 0.4) +
    (urgency * 0.3) +
    (confidence * 0.3);

  return {
    recommendation: insight.text,
    type: insight.type,
    score: Math.round(score),
    impact: Math.round(impact),
    urgency: Math.round(urgency),
    confidence: Math.round(confidence),
    actionLevel:
      score > 80
        ? "HIGH PRIORITY"
        : score > 50
        ? "MEDIUM PRIORITY"
        : "LOW PRIORITY"
  };
}

/**
 * 🧠 Rank all insights
 */
function rankInsights() {

  const ranked = insightsPool.map(scoreInsight);

  return ranked.sort((a, b) => b.score - a.score);
}

/**
 * 🎛 SYSTEM OUTPUT FOR ADMIN
 */
function getRankedInsights() {

  return {
    total: insightsPool.length,
    ranked: rankInsights()
  };
}

/**
 * 🧠 Hook into multi-agent system
 */
bus.on("MULTI_AGENT_OUTPUT", (data) => {

  collectInsights(data);
});

module.exports = {
  getRankedInsights
};
