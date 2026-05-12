const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V5 - Immutable Ledger Engine
 * Every financial action is recorded as an event
 */

const ledger = [];

function addEntry(entry) {
  ledger.push({
    id: Date.now() + Math.random(),
    ...entry,
    timestamp: new Date().toISOString()
  });
}

function getBalance(userId) {
  let balance = 0;

  for (const entry of ledger) {
    if (entry.userId !== userId) continue;

    if (entry.type === "CREDIT") balance += entry.amount;
    if (entry.type === "DEBIT") balance -= entry.amount;
  }

  return balance;
}

function getLedger(userId) {
  return ledger.filter(e => e.userId === userId);
}

module.exports = {
  addEntry,
  getBalance,
  getLedger
};
