const crypto = require("crypto");

let ledger = [];

function hashEvent(event, prevHash = "") {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(event) + prevHash)
    .digest("hex");
}

function appendEvent(event) {
  const prev = ledger.length ? ledger[ledger.length - 1].hash : "";
  const hash = hashEvent(event, prev);

  const record = {
    ...event,
    prevHash: prev,
    hash,
    ts: Date.now()
  };

  ledger.push(record);
  return record;
}

function getLedger() {
  return ledger;
}

module.exports = { appendEvent, getLedger };
