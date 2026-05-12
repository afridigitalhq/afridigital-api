const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7.1 - Full Pricing Intelligence Engine
 */

const couponEngine = require("../economy/afri.coupon.v7");
const systemCoupon = require("../economy/afri.coupon.engine");
const rewardEngine = require("../economy/afri.reward.engine");

function formatBoostQuote(label, unitPrice, quantity, user = {}, couponCode = null) {

  const rawTotal = unitPrice * quantity;

  // System discount (Friday/events)
  let systemDiscounted = systemCoupon.applyDiscount(rawTotal);

  // Coupon check
  let couponDiscount = 0;
  let couponStatus = "NO_COUPON";

  if (couponCode) {
    const result = couponEngine.validateCoupon(couponCode);
    if (result.valid) {
      couponDiscount = result.discount;
      couponStatus = "VALID";
    } else {
      couponStatus = result.message;
    }
  }

  let afterCoupon = systemDiscounted - (systemDiscounted * couponDiscount / 100);

  // Reward (tier-based)
  let rewardDiscount = 0;

  if (user?.reward?.discount) {
    rewardDiscount = user.reward.discount;
  }

  let finalTotal = afterCoupon - (afterCoupon * rewardDiscount / 100);

  const saved = rawTotal - finalTotal;

  return `
👉 🎵 ${label} Boost Quote

1 view = ${unitPrice} Africoin

${quantity} views:
${quantity} × ${unitPrice} = ${rawTotal} Africoin

🎟️ System Discount: applied
🎟️ Coupon: ${couponStatus}
🎁 Reward Applied: ${rewardDiscount}%

💰 Final Cost: ${finalTotal} Africoin
💡 You saved: ${saved} Africoin

━━━━━━━━━━━━━━━━━━
🚀 BOOST CAMPAIGN
━━━━━━━━━━━━━━━━━━
`;
}

module.exports = {
  formatBoostQuote
};
