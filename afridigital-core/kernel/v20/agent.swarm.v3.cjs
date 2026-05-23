const { runSwarm } = require("./agent.swarm.v2.cjs");
const {
  computeRevenueIntent,
  classifyValue,
  computeStrategy
} = require("./revenue.brain.v3.cjs");

async function runSwarmV3(redis, message) {

  // 1. Run swarm v2 reasoning
  const decision = await runSwarm(redis, message);

  // 2. Load memory
  const memoryKey = message.user;
  const memory = {}; // (optional: plug real memory loader here)

  // 3. Revenue intelligence layer
  const revenueScore = computeRevenueIntent(message, memory);
  const valueClass = classifyValue(revenueScore);
  const strategy = computeStrategy(valueClass);

  // 4. Merge business logic into decision
  const enrichedDecision = {
    ...decision,
    revenueScore,
    valueClass,
    strategy,
    monetization: {
      shouldUpsell: valueClass === "HIGH_LTV",
      shouldDiscount: strategy.discount > 0,
      urgency: strategy.priority
    }
  };

  return enrichedDecision;
}

module.exports = { runSwarmV3 };
