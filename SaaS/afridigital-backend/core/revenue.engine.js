const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 💰 AfriOS Revenue Engine v2.8 (Final Patch)
 * Supports native ads + external ad injection layer
 */

function calculateSplit(ad) {

  const amount = ad.amount || 0;
  const type = ad.type || "TASK";

  let users = 0;
  let platform = 0;
  let externalEligible = false;

  switch (type) {

    // 👷 Task Ads (engagement-based)
    case "TASK":
      users = amount * 0.6;
      platform = amount * 0.4;
      externalEligible = false;
      break;

    // 📣 BOOST Ads (visibility / impressions only)
    case "BOOST":
      users = 0;
      platform = amount;
      externalEligible = true; // 🔥 AdSense / external monetization allowed
      break;

    // ⚡ HYBRID Ads
    case "HYBRID":
      users = amount * 0.5;
      platform = amount * 0.5;
      externalEligible = true;
      break;

    default:
      users = amount * 0.6;
      platform = amount * 0.4;
  }

  return {
    users: Math.floor(users),
    platform: Math.floor(platform),
    total: amount,

    // 🌐 external monetization flag
    externalAdsEnabled: externalEligible,

    meta: {
      type,
      note:
        type === "BOOST"
          ? "100% Platform Revenue - Visibility Monetization Only"
          : "Standard Revenue Split"
    }
  };
}

module.exports = {
  calculateSplit
};
