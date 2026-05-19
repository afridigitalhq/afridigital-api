const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V9 - Adaptive Offer Intelligence Engine
 */

function detectIntentScore(context = {}) {

  let score = 50;

  if (context.repeatUser) score += 20;
  if (context.multipleQueries) score += 15;
  if (context.fastReplies) score += 10;
  if (context.couponHunting) score -= 25;
  if (context.abandonRisk) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function decideOfferLevel(score) {

  if (score >= 75) return "LOW_PROMO";
  if (score >= 45) return "NORMAL_PROMO";
  return "HIGH_PROMO";
}

function generateAdaptiveOffer(user, baseDiscount) {

  const score = detectIntentScore(user.context || {});
  const level = decideOfferLevel(score);

  let discount = baseDiscount;

  if (level === "HIGH_PROMO") discount += 5;
  if (level === "LOW_PROMO") discount -= 3;

  return {
    intentScore: score,
    promoLevel: level,
    finalDiscount: Math.max(0, discount)
  };
}

module.exports = {
  detectIntentScore,
  decideOfferLevel,
  generateAdaptiveOffer
};
