const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V6 - Smart Quote Engine
 * Discount-aware pricing system
 */

const coupon = require("../economy/afri.coupon.engine");

function formatBoostQuote(label, unitPrice, quantity) {

  const rawTotal = unitPrice * quantity;
  const finalTotal = coupon.applyDiscount(rawTotal);

  return `
👉 🎵 ${label} Quote

1 unit = ${unitPrice} Africoin

${quantity} units:
${quantity} × ${unitPrice} = ${rawTotal} Africoin

🎟️ Discount Applied: ${coupon.getDiscount()}%

💰 Final Cost: ${finalTotal} Africoin

━━━━━━━━━━━━━━━━━━
🚀 BOOST NOW
━━━━━━━━━━━━━━━━━━
`;
}

module.exports = {
  formatBoostQuote
};
