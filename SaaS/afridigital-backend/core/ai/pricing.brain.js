const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🧠 AfriAI Pricing Brain (V4)
 * LIVE ADMIN CONTROLLED PRICING SYSTEM
 */

const pricingTable = {
  "youtube_view": 10,
  "tiktok_view": 10,
  "boost_default": 10
};

function getPrice(key) {
  return pricingTable[key] || pricingTable["boost_default"];
}

function updatePrice(key, value) {
  pricingTable[key] = value;
}

function getAllPrices() {
  return pricingTable;
}

module.exports = {
  getPrice,
  updatePrice,
  getAllPrices
};
