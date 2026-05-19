
const fs = require("fs");
const path = require("path");

const AUDIT_FILE = path.join(__dirname, "audit.log.jsonl");

function logTransaction(tx) {
  const entry = {
    timestamp: Date.now(),
    id: tx.id,
    userId: tx.userId,
    amount: tx.amount,
    type: tx.type,
    source: tx.source,
    hash: Buffer.from(JSON.stringify(tx)).toString("base64")
  };

  fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + "\n");
  return entry;
}

function readAudit() {
  if (!fs.existsSync(AUDIT_FILE)) return [];
  return fs.readFileSync(AUDIT_FILE, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

module.exports = { logTransaction, readAudit };

