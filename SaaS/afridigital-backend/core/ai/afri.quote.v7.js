const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7 - Adaptive Quote Engine
 */

const coupon = require("../economy/afri.coupon.engine");
const reward = require("../economy/afri.reward.engine");

function formatBoostQuote(label, unitPrice, quantity, userReward = null) {

  const rawTotal = unitPrice * quantity;

  let totalAfterGlobal = coupon.applyDiscount(rawTotal);
  let finalTotal = reward.applyUserReward(totalAfterGlobal, userReward);

  const saved = rawTotal - finalTotal;

  return `
👉 🎵 ${label} Quote

1 unit = ${unitPrice} Africoin

${quantity} units:
${quantity} × ${unitPrice} = ${rawTotal} Africoin

🎟️ System Discount: ${coupon.getDiscount()}%
🎁 Your Reward Applied: ${userReward?.discount || 0}%

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
