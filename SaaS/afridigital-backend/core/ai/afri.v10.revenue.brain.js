const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V10 - Revenue Decision Intelligence Core
 */

function getDiscountCap(tier) {
  return tier === "PREMIUM" ? 20 : 15;
}

function decideDiscount(user) {

  const tierCap = getDiscountCap(user.tier);

  const intent = user.intentScore || 50;
  const risk = user.conversionRisk || 50;
  const campaign = user.campaignActive || false;

  let discount = 0;

  // 🔥 FULL DISCOUNT MODE (rescue logic)
  if (risk > 70 && intent < 50 && campaign) {
    discount = tierCap;
  }

  // 🧠 STANDARD MODE (balanced conversion)
  else if (intent >= 50 && intent < 80) {
    discount = Math.floor(tierCap * 0.6);
  }

  // 🚫 HIGH INTENT MODE (protect revenue)
  else if (intent >= 80) {
    discount = Math.floor(tierCap * 0.3);
  }

  // 🚀 URGENCY MODE (no deeper discount, stronger CTA)
  const urgency = (user.delay || 0) > 30;

  return {
    discount,
    tierCap,
    urgencyBoost: urgency,
    mode:
      risk > 70 ? "RESCUE_PROMO" :
      intent >= 80 ? "PROTECT_REVENUE" :
      "NORMAL_CONVERSION"
  };
}

module.exports = {
  decideDiscount
};
