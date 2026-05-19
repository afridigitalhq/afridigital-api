const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V3.5 - AfriPricing Brain
 * Single Source of Truth for all pricing + conversions
 */

const PRICING = {
  youtube_view: 10,        // 1 view = 10 Africoin
  tiktok_view: 8,
  link_click: 5,
  video_watch: 12
};

// 💱 Revenue Split Rules
const SPLIT = {
  worker: 0.60,
  platform: 0.40
};

// 🧠 Get price for action
function getPrice(action, quantity = 1) {
  const rate = PRICING[action] || 0;
  return rate * quantity;
}

// 💰 Calculate split (IMPORTANT RULE)
function calculateSplit(amount) {
  return {
    worker: Math.floor(amount * SPLIT.worker),
    platform: Math.floor(amount * SPLIT.platform)
  };
}

// 📦 Full quote engine (AfriAI uses this)
function generateQuote(action, quantity) {
  const total = getPrice(action, quantity);
  const split = calculateSplit(total);

  return {
    action,
    quantity,
    totalAfricoin: total,

    // ⚠️ IMPORTANT: Worker ONLY sees this
    workerEarning: split.worker,

    platformEarning: split.platform,

    split
  };
}

module.exports = {
  getPrice,
  calculateSplit,
  generateQuote,
  PRICING,
  SPLIT
};
