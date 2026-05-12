const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V3.3-B REVENUE ENGINE
 * - Boost = 100% platform revenue
 * - Task = escrow + split payout
 */

function calculateBoostCost(ratePerUnit, units) {
  return ratePerUnit * units;
}

function routeRevenue({ type, amount }) {

  // 📣 BOOST ADS → 100% PLATFORM
  if (type === "BOOST_AD") {
    return {
      platform: amount,
      worker: 0,
      escrow: 0
    };
  }

  // 🧑‍💻 TASK → ESCROW HOLD
  if (type === "TASK_PAYMENT") {
    return {
      platform: 0,
      worker: 0,
      escrow: amount
    };
  }

  // ✅ TASK COMPLETION SPLIT
  if (type === "TASK_APPROVED") {
    return {
      worker: amount * 0.6,
      platform: amount * 0.4,
      escrow: 0
    };
  }

  // ⏱ AUTO TIMEOUT RELEASE
  if (type === "TASK_TIMEOUT") {
    return {
      worker: amount * 0.6,
      platform: amount * 0.4,
      escrow: 0
    };
  }

  return { worker: 0, platform: 0, escrow: 0 };
}

module.exports = {
  calculateBoostCost,
  routeRevenue
};
