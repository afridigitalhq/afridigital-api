const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 💼 FULL WALLET VIEWER
 */

function renderWallet(user = {}) {

  const nativeBalance = user.nativeBalance || 0;
  const africoinBalance = user.africoinBalance || 0;
  const escrowBalance = user.escrowBalance || 0;

  return `
💼 FULL WALLET BALANCE

💵 Native Wallet:
₦${nativeBalance}

🪙 Africoin Wallet:
${africoinBalance} Africoin

🔒 Escrow Wallet:
${escrowBalance} Africoin

━━━━━━━━━━━━━━━━━━
🔄 CONVERT AFRICOIN
━━━━━━━━━━━━━━━━━━
`;
}

module.exports = {
  renderWallet
};
