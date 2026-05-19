const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V3.8 - AfriBoost Quote Engine (CTA ENABLED)
 * Clean pricing + actionable boost button
 */

function formatBoostQuote(unitPrice, quantity, label, actionId = "BOOST_NOW") {

  const total = unitPrice * quantity;

  return `
👉 🎵 ${label} Quote

1 view = ${unitPrice} Africoin

${quantity} views:
${quantity} × ${unitPrice} = ${total} Africoin

💰 Total Cost: ${total} Africoin

━━━━━━━━━━━━━━━━━━
👉 🚀 BOOST NOW (${actionId})
━━━━━━━━━━━━━━━━━━
`;
}

function generateQuote(action, quantity = 1, pricingDB = {}) {

  const unitPrice = pricingDB[action] || 0;
  const total = unitPrice * quantity;

  return {
    action,
    unitPrice,
    quantity,
    total,
    cta: "BOOST_NOW",
    breakdown: `${quantity} × ${unitPrice} = ${total} Africoin`
  };
}

module.exports = {
  formatBoostQuote,
  generateQuote
};
