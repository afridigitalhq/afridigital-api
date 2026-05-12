const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🏦 AfriOS Treasury Engine v1.8
 */

const fs = require('fs');
const path = require('path');

const LEDGER_DB = path.join(
  __dirname,
  '../storage/ledger/ledger.database.json'
);

const WD_DB = path.join(
  __dirname,
  '../storage/withdrawals/withdrawal.queue.json'
);

// 📦 LOAD HELPERS
function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return [];
  }
}

// 📊 TREASURY SUMMARY
function getTreasurySummary() {

  const ledger = load(LEDGER_DB);
  const withdrawals = load(WD_DB);

  let totalEarned = 0;
  let totalDeposited = 0;
  let totalWithdrawn = 0;
  let totalEscrow = 0;

  for (const tx of ledger) {

    if (tx.type === "EARN") {
      totalEarned += tx.amount;
    }

    if (tx.type === "TOPUP") {
      totalDeposited += tx.amount;
    }

    if (tx.type === "WITHDRAW") {
      totalWithdrawn += tx.amount;
    }

    if (tx.type === "ESCROW_LOCK") {
      totalEscrow += tx.amount;
    }

    if (tx.type === "ESCROW_RELEASE") {
      totalEscrow -= tx.amount;
    }
  }

  return {
    totalTransactions: ledger.length,

    treasury: {
      totalEarned,
      totalDeposited,
      totalWithdrawn,
      totalEscrow
    },

    withdrawals: {
      total: withdrawals.length,

      pending:
        withdrawals.filter(
          w => w.status === "PENDING"
        ).length,

      blocked:
        withdrawals.filter(
          w => w.status === "BLOCKED"
        ).length
    }
  };
}

// 🚨 HIGH RISK USERS
function getHighRiskWithdrawals() {

  const withdrawals = load(WD_DB);

  return withdrawals.filter(
    w => w.fraud?.risk === "HIGH"
  );
}

module.exports = {
  getTreasurySummary,
  getHighRiskWithdrawals
};
