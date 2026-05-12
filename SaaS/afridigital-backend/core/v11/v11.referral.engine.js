const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 REFERRAL ENGINE V11
 */

function generateReferralMessage(username, reward, wallet) {

  return `
📩 New Referral Reward

@${username} just joined using your link

💰 +${reward} Africoin credited to your wallet

💼 Wallet Balance:
💵 Native: ₦${wallet.native || 0}
🪙 Africoin: ${wallet.africoin || 0}
🔒 Escrow: ${wallet.escrow || 0}

━━━━━━━━━━━━━━━━━━
🔄 CONVERT AFRICOIN
━━━━━━━━━━━━━━━━━━
`;
}

module.exports = {
  generateReferralMessage
};
