/**
 * 🔥 AI Revenue Optimization Simulator
 * (BEFORE vs AFTER Marketplace Impact Engine)
 */

const { runSimulation } = require("../../admin/simulation-lab");

/**
 * Baseline + Optimized comparison
 */
function simulateRevenueImpact(config) {

  // BEFORE state (current system)
  const before = runSimulation({
    users: config.users || 100,
    jobMultiplier: 1,
    boostMultiplier: 1
  });

  // AFTER state (optimized system)
  const after = runSimulation({
    users: config.users || 100,
    jobMultiplier: config.jobBoost || 1.5,
    boostMultiplier: config.boostBoost || 2
  });

  /**
   * Revenue calculation model (simplified)
   */
  const revenueModel = (state) => {

    return (
      state.result.earnings * 0.7 +
      state.result.jobs * 2 +
      state.result.boosts * 5
    );
  };

  const beforeRevenue = revenueModel(before);
  const afterRevenue = revenueModel(after);

  const delta = afterRevenue - beforeRevenue;

  return {
    baseline: {
      revenue: beforeRevenue,
      economy: before.result
    },

    optimized: {
      revenue: afterRevenue,
      economy: after.result
    },

    impact: {
      absoluteChange: delta,
      percentChange: (delta / beforeRevenue) * 100
    },

    recommendation:
      delta > 0
        ? "OPTIMIZATION VALID - DEPLOY STRATEGY"
        : "NO BENEFIT - REVISE PARAMETERS"
  };
}

module.exports = {
  simulateRevenueImpact
};
