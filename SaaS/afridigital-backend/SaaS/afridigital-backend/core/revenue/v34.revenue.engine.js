const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS v3.4 Revenue Split Engine
 * - Boost Ads: 100% platform
 * - Jobs: 60% worker / 40% platform
 */

function calculateSplit(amount, type = "JOB") {

  // 📣 BOOST ADS (NO WORKER)
  if (type === "BOOST") {
    return {
      worker: 0,
      platform: amount,
      escrow: 0
    };
  }

  // 💼 JOB SYSTEM (ESCROW SPLIT)
  if (type === "JOB") {
    return {
      worker: Math.floor(amount * 0.60),
      platform: Math.floor(amount * 0.40),
      escrow: amount
    };
  }

  return {
    worker: 0,
    platform: amount,
    escrow: 0
  };
}

/**
 * 🧾 CARD SAFE REWARD DISPLAY
 * ONLY shows worker share
 */
function getDisplayReward(amount, type = "JOB") {

  const split = calculateSplit(amount, type);

  return split.worker; // 🚨 IMPORTANT: never expose full amount
}

module.exports = {
  calculateSplit,
  getDisplayReward
};
