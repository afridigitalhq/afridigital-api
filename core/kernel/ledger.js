// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "ci-ledger.log");

function append(event) {
  const line = JSON.stringify({
    ...event,
    ts: Date.now()
  }) + "\n";

  fs.appendFileSync(LOG_FILE, line);
}

module.exports = { append };
