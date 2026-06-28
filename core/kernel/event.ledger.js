// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const fs = require("fs");
const path = require("path");

const LEDGER_PATH = path.join(__dirname, "ledger.log");

function appendEvent(event) {
  const record = {
    id: Date.now() + "-" + Math.random(),
    ts: Date.now(),
    ...event
  };

  fs.appendFileSync(LEDGER_PATH, JSON.stringify(record) + "\n");
  return record;
}

function readLedger() {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  return fs.readFileSync(LEDGER_PATH, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
}

module.exports = { appendEvent, readLedger };
