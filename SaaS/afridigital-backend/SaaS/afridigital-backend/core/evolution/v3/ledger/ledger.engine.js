/**
 * 🧊 SNAPSHOT LEDGER v3
 * Blockchain-style evolution history (3-level rollback minimum)
 */

const ledger = [];

function pushSnapshot(snapshot) {
  ledger.push(snapshot);

  if (ledger.length > 50) ledger.shift();
}

function getLastSnapshots(n = 3) {
  return ledger.slice(-n);
}

function rollback() {
  return ledger.pop();
}

module.exports = {
  pushSnapshot,
  getLastSnapshots,
  rollback
};
