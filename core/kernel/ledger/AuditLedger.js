// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const crypto = require("crypto");
const fs = require("fs");

class AuditLedger {
  constructor(filePath = "./core/kernel/ledger/audit.log") {
    this.filePath = filePath;
    this.lastHash = "GENESIS";
  }

  append(event) {
    const record = {
      ts: Date.now(),
      event,
      prevHash: this.lastHash
    };

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(record))
      .digest("hex");

    record.hash = hash;
    this.lastHash = hash;

    fs.appendFileSync(this.filePath, JSON.stringify(record) + "\n");

    return record;
  }

  readAll() {
    return fs.readFileSync(this.filePath, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse);
  }
}

module.exports = { AuditLedger };
