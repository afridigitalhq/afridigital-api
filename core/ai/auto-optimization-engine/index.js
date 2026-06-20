/**
 * 🧠 AI Marketplace Auto-Optimization Engine
 * (ADMIN GUIDED STRATEGY LAYER - NO AUTO EXECUTION)
 */

const bus = require("../../eventbus");

/**
 * Internal market memory
 */
const state = {
  demand: {},
  supply: {},
  insights: []
};

/**
 * Capture marketplace signals
 */
bus.on("JOB_REQUEST", (data) => {

  state.demand[data.type] = (state.demand[data.type] || 0) + 1;
});

bus.on("SERVICE_CREATED", (data) => {

  state.supply[data.type] = (state.supply[data.type] || 0) + 1;
});

/**
 * Detect imbalance between demand and supply
 */
function detectImbalance() {

  const report = [];

  Object.keys(state.demand).forEach(type => {

    const demand = state.demand[type] || 0;
    const supply = state.supply[type] || 0;

    const gap = demand - supply;

    if (gap > 5) {
      report.push({
        type,
        status: "HIGH_DEMAND_LOW_SUPPLY",
        gap
      });
    }

    if (gap < -5) {
      report.push({
        type,
        status: "HIGH_SUPPLY_LOW_DEMAND",
        gap
      });
    }
  });

  return report;
}

/**
 * Generate AI guidance (NOT execution)
 */
function generateRecommendations() {

  const imbalance = detectImbalance();

  const recommendations = imbalance.map(item => {

    if (item.status === "HIGH_DEMAND_LOW_SUPPLY") {

      return {
        type: item.type,
        action: "INCREASE_CONTENT_VISIBILITY",
        suggestion: [
          "Promote tutorials for this category",
          "Boost marketplace listings",
          "Highlight creators offering this service"
        ]
      };
    }

    return {
      type: item.type,
      action: "BALANCE_SUPPLY",
      suggestion: [
        "Encourage demand via campaigns",
        "Reposition services in UI"
      ]
    };
  });

  state.insights = recommendations;

  return recommendations;
}

/**
 * ADMIN VIEW ONLY
 */
function getInsights() {
  return {
    demand: state.demand,
    supply: state.supply,
    recommendations: state.insights
  };
}

module.exports = {
  detectImbalance,
  generateRecommendations,
  getInsights
};
