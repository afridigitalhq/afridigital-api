const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7.2 - Correct Pricing Flow Engine
 */

function formatBoostQuote(label, unitPrice, quantity, user = {}) {

  const total = unitPrice * quantity;

  const tier = user?.tier || "BASIC";
  const maxDiscount = tier === "PREMIUM" ? 20 : 15;

  const discounted = total - (total * maxDiscount / 100);

  return `
👉 🎵 ${label} Boost Quote

1 unit = ${unitPrice} Africoin

${quantity} units:
${quantity} × ${unitPrice} = ${total} Africoin

💰 Total Cost: ${discounted} Africoin

━━━━━━━━━━━━━━━━━━
💡 Do you have a coupon code?
━━━━━━━━━━━━━━━━━━

🚀 BOOST CAMPAIGN
`;
}

module.exports = {
  formatBoostQuote
};
