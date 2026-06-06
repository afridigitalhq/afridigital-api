const { runGrowthEngine } = require("../../marketplace/growth-engine");

function estimatePrice(category, demand = {}, supply = {}) {

  const d = demand[category] || 1;
  const s = supply[category] || 1;

  const pressure = d / s;

  let base = 10;

  if (pressure > 2) base *= 2.5;
  else if (pressure > 1.2) base *= 1.5;
  else if (pressure < 1) base *= 0.8;

  return Math.round(base * 100) / 100;
}

function buildCoPilotFlow(input, marketData) {

  const growth = runGrowthEngine(marketData);

  const category = input.category || "general";

  const price = estimatePrice(
    category,
    growth.demand,
    growth.supply
  );

  return {
    step: "CO_PILOT_GUIDE",
    categorySuggestions: Object.keys(growth.demand || {}),
    pricingSuggestion: price,
    demandSignal: growth.imbalances,
    guidance: [
      "Describe your service clearly",
      "Add skill tags",
      "Set delivery time",
      "Confirm pricing"
    ]
  };
}

module.exports = { buildCoPilotFlow };
