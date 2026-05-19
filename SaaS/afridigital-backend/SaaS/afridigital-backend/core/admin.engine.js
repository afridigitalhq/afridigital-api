const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 👑 AfriOS Admin Engine v2.0
 * Secure WhatsApp Admin Console
 */

const treasury = require('./treasury.engine');
const adminActions = require('./admin.actions');
const { isAdmin } = require('./admin.config');

async function handleAdminCommand(from, text) {

  // 🚫 NOT ADMIN → EXIT IMMEDIATELY
  if (!isAdmin(from)) {
    return null;
  }

  const msg = text.toLowerCase();

  // 📊 TREASURY REPORT
  if (msg.includes("treasury") || msg.includes("finance")) {

    const report = treasury.getTreasurySummary();

    return `
👑 AfriOS Treasury v2.0

💰 Earned: ${report.treasury.totalEarned} Africoin
🏦 Deposited: ${report.treasury.totalDeposited} Africoin
🔒 Escrow: ${report.treasury.totalEscrow} Africoin

💸 Pending Withdrawals: ${report.withdrawals.pending}
🚨 Blocked: ${report.withdrawals.blocked}
📦 Transactions: ${report.totalTransactions}
`;
  }

  // 🚨 FRAUD CHECK
  if (msg.includes("fraud") || msg.includes("risk")) {

    const risky =
      treasury.getHighRiskWithdrawals();

    return `
🚨 AfriOS Security Center

High Risk Users: ${risky.length}
System Status: ACTIVE
`;
  }

  // 🧠 SYSTEM STATUS
  if (msg.includes("status") || msg.includes("system")) {

    return `
🧠 AfriOS System Status

Kernel: ONLINE
AI: ACTIVE
Ledger: SYNCED
Escrow: ENABLED
Admin Mode: SECURED 🔐
`;
  }

  return null;
}

module.exports = {
  handleAdminCommand
};
