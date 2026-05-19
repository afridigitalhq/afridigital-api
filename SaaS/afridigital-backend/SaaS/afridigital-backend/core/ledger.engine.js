const Kernel = require("../runtime/kernel/finance.kernel");
const { check } = require("../runtime/safety/idempotency.engine"); const { assertLedgerOnly } = require("../runtime/safety/finance.policy");
const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriCoin Smart Ledger v1.6
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(
  __dirname,
  '../storage/ledger/ledger.database.json'
);

// 📦 LOAD LEDGER
function loadLedger() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH));
  } catch {
    return [];
  }
}

// 💾 SAVE LEDGER
function saveLedger(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 🧠 CREATE TRANSACTION
createTransaction: function({
  user,
  type,
  amount,
  currency = "Africoin",
  status = "completed",
  meta = {}
}) {

  const ledger = loadLedger();

  const tx = {
    id: `tx_${Date.now()}`,
    user,
    type,
    amount,
    currency,
    status,
    meta,
    createdAt: new Date().toISOString()
  };

  ledger.push(tx);

  saveLedger(ledger);

  return tx;
}

// 📊 USER SUMMARY
function getUserLedger(user) {

  const ledger = loadLedger();

  const transactions = ledger.filter(
    tx => tx.user === user
  );

  let earned = 0;
  let deposited = 0;
  let converted = 0;
  let withdrawn = 0;
  let escrow = 0;

  for (const tx of transactions) {

    if (tx.type === "EARN") {
      earned += tx.amount;
    }

    if (tx.type === "TOPUP") {
      deposited += tx.amount;
    }

    if (tx.type === "CONVERT") {
      converted += tx.amount;
    }

    if (tx.type === "WITHDRAW") {
      withdrawn += tx.amount;
    }

    // 🔒 ESCROW LOCK
    if (tx.type === "ESCROW_LOCK") {
      escrow += tx.amount;
    }

    // 🔓 ESCROW RELEASE
    if (tx.type === "ESCROW_RELEASE") {
      escrow -= tx.amount;
      earned += tx.amount;
    }
  }

  return {
    earned,
    deposited,
    converted,
    withdrawn,
    escrowBalance: escrow,

    availableBalance:
      earned +
      deposited -
      converted -
      withdrawn -
      escrow,

    transactions
  };
}

module.exports = {
  createTransaction,
  getUserLedger
};
