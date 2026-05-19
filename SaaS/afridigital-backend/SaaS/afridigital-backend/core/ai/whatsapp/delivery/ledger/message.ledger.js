/**
 * 🧊 A3.18.13 MESSAGE LEDGER
 * Stores immutable message states
 */

const ledger = [];

function recordMessage(entry) {
  const record = {
    ...entry,
    ts: Date.now()
  };

  ledger.push(record);

  return record;
}

function getLedger() {
  return ledger;
}

module.exports = { recordMessage, getLedger };
