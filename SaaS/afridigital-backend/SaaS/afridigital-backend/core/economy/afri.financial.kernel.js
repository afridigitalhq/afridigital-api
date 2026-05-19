const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V4 - Financial Kernel
 * Single source of truth for ALL money flows
 */

const pricingBrain = require("../ai/pricing.brain");

function calculateCost(action, quantity) {
  const unitPrice = pricingBrain.getPrice(action);
  return unitPrice * quantity;
}

function splitFunds(total, mode = "ESCROW") {

  if (mode === "DIRECT") {
    return {
      worker: 0,
      platform: total,
      escrow: 0
    };
  }

  return {
    worker: total * 0.6,
    platform: total * 0.4,
    escrow: total
  };
}

function processBoost({ action, quantity, mode }) {

  const total = calculateCost(action, quantity);
  const split = splitFunds(total, mode);

  return {
    action,
    quantity,
    total,
    split,
    status: "READY_FOR_PAYMENT"
  };
}

module.exports = {
  calculateCost,
  splitFunds,
  processBoost
};
