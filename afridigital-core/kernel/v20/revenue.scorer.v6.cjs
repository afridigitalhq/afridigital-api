const { computeRevenueObjective } = require("./revenue.objective.v6.cjs");

async function scoreMessage(redis, message, customer) {

  const intentScore =
    (message.text.includes("buy") ? 0.5 : 0) +
    (message.text.includes("price") ? 0.3 : 0);

  const conversionProb = customer.ltv;

  const urgency =
    message.text.includes("now") ? 0.8 : 0.2;

  const score = computeRevenueObjective({
    intentScore,
    conversionProb,
    lifetimeValue: customer.ltv,
    urgency
  });

  return {
    score,
    intentScore,
    conversionProb,
    urgency
  };
}

module.exports = { scoreMessage };
