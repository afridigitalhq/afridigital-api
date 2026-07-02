const { analyzeMarket } = require("./analyzer");
const { detectImbalance } = require("./imbalance");
const { generateSuggestions } = require("./suggestions");

function runGrowthEngine(data) {

  const { demand, supply } = analyzeMarket(data);

  const imbalances = detectImbalance(demand, supply);

  const suggestions = generateSuggestions(imbalances);

  return {
    demand,
    supply,
    imbalances,
    suggestions
  };
}

module.exports = { runGrowthEngine };
