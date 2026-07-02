const { runEconomyIntelligence } = require("../economy/intelligence/orchestrator");
const bus = require('../eventbus');

async function economyIntelligenceBrain(data) {

  const result = runEconomyIntelligence(data);

  bus.emit("AI_ECONOMY_INSIGHTS", result);

  return result;
}

module.exports = { economyIntelligenceBrain };
