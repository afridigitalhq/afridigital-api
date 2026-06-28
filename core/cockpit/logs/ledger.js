const ledger = [];

function append(entry) {
  const record = {
    id: Date.now() + "-" + Math.random().toString(16).slice(2),
    ts: Date.now(),
    ...entry
  };

  ledger.push(record);
  return record;
}

function getLedger() {
  return ledger;
}

module.exports = { append, getLedger };
