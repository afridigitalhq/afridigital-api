const fs = require("fs");

const LEDGER = "./logs/wallet-ledger.log";

function record(entry) {
  fs.appendFileSync(
    LEDGER,
    JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString()
    }) + "\n"
  );
}

module.exports = { record };
