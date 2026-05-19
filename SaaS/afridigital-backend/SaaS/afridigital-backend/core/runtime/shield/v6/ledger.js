const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "ledger.log.json");

function log(event) {
  const existing = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE))
    : [];

  existing.push(event);

  fs.writeFileSync(LOG_FILE, JSON.stringify(existing, null, 2));
}

module.exports = { log };
