/**
 * 🧠 Multi-Agent Autonomous Economy Orchestration Layer
 * SAFE GOVERNED MARKETPLACE INTELLIGENCE SYSTEM
 */

const bus = require("../../eventbus");

/**
 * 🧠 AGENT REGISTRY
 */
const agents = {
  demand: {},
  supply: {},
  pricing: {},
  growth: {},
  policy: {},
  simulation: {}
};

/**
 * 📊 DEMAND AGENT
 */
function demandAgent(event) {

  const key = event.type || "general";

  agents.demand[key] = (agents.demand[key] || 0) + 1;

  return {
    type: "DEMAND_SIGNAL",
    insight: `Demand increasing for ${key}`,
    value: agents.demand[key]
  };
}

/**
 * 🛠 SUPPLY AGENT
 */
function supplyAgent(event) {

  const key = event.type || "general";

  agents.supply[key] = (agents.supply[key] || 0) + 1;

  return {
    type: "SUPPLY_SIGNAL",
    insight: `Supply tracked for ${key}`,
    value: agents.supply[key]
  };
}

/**
 * 💰 PRICING AGENT
 */
function pricingAgent(event) {

  const demand = agents.demand[event.type] || 1;
  const supply = agents.supply[event.type] || 1;

  const suggestedPrice = (demand / supply) * 100;

  return {
    type: "PRICING_SIGNAL",
    suggestion: suggestedPrice.toFixed(2),
    insight: "Dynamic pricing recommendation based on demand/supply ratio"
  };
}

/**
 * 🚀 GROWTH AGENT
 */
function growthAgent(event) {

  const demand = agents.demand[event.type] || 0;

  return {
    type: "GROWTH_SIGNAL",
    insight:
      demand > 10
        ? "Recommend boosting visibility"
        : "Maintain current exposure",
    demandLevel: demand
  };
}

/**
 * ⚖️ POLICY AGENT (SAFE CHECK ONLY)
 */
function policyAgent(event) {

  return {
    type: "POLICY_SIGNAL",
    allowed: true,
    note: "No violation detected (simulation mode)"
  };
}

/**
 * 🧪 SIMULATION AGENT
 */
function simulationAgent(event) {

  return {
    type: "SIMULATION_SIGNAL",
    forecast: {
      impact: Math.random() * 100,
      confidence: 0.7 + Math.random() * 0.3
    }
  };
}

/**
 * 🎛 ORCHESTRATOR (MAIN COORDINATOR)
 */
function orchestrate(event) {

  return {
    demand: demandAgent(event),
    supply: supplyAgent(event),
    pricing: pricingAgent(event),
    growth: growthAgent(event),
    policy: policyAgent(event),
    simulation: simulationAgent(event)
  };
}

/**
 * 🧠 SYSTEM HOOK INTO EVENT BUS
 */
bus.on("MARKET_EVENT", (event) => {

  const result = orchestrate(event);

  console.log("🧠 MULTI-AGENT OUTPUT:", result);
});

module.exports = {
  orchestrate
};
