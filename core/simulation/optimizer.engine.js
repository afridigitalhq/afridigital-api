const bus = require('../eventbus');

function optimizeEconomy(state) {

  const signals = {
    boostJobs: state.jobsDemand > state.earnSupply,
    boostEarn: state.earnSupply < state.jobsDemand,
    balanceServices: state.servicesDemand > 10,
    walletStability: state.walletFlow > 5
  };

  const recommendations = [];

  if (signals.boostJobs) {
    recommendations.push({
      action: "BOOST_JOBS_VISIBILITY",
      reason: "High job demand detected"
    });
  }

  if (signals.boostEarn) {
    recommendations.push({
      action: "BOOST_EARN_TASKS",
      reason: "Low earn supply detected"
    });
  }

  bus.emit("ECONOMY_OPTIMIZED", recommendations);

  return recommendations;
}

module.exports = { optimizeEconomy };
