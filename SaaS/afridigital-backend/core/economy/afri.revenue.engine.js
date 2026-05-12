const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V3.9 - Revenue Execution Engine
 * Handles Boost pricing + Escrow + Revenue Split
 */

function calculateBoostCost(unitPrice, quantity) {
  return unitPrice * quantity;
}

/**
 * 🧠 Revenue Split Rules
 * mode:
 *  - "DIRECT" = 100% platform
 *  - "ESCROW" = 60% worker / 40% platform
 */
function splitRevenue(total, mode = "ESCROW") {

  if (mode === "DIRECT") {
    return {
      worker: 0,
      platform: total,
      escrow: 0
    };
  }

  if (mode === "ESCROW") {
    return {
      worker: total * 0.6,
      platform: total * 0.4,
      escrow: total
    };
  }

  return {
    worker: 0,
    platform: total,
    escrow: 0
  };
}

/**
 * 📦 Boost Quote Generator (Clean UI Layer)
 */
function formatBoostQuote(unitPrice, quantity, label, mode = "ESCROW") {

  const total = calculateBoostCost(unitPrice, quantity);
  const split = splitRevenue(total, mode);

  return `
👉 🎵 ${label} Quote

1 unit = ${unitPrice} Africoin

${quantity} units:
${quantity} × ${unitPrice} = ${total} Africoin

💰 Total Cost: ${total} Africoin

━━━━━━━━━━━━━━━━━━
🚀 BOOST NOW
━━━━━━━━━━━━━━━━━━
`;
}

module.exports = {
  calculateBoostCost,
  splitRevenue,
  formatBoostQuote
};
