const fs = require("fs");
const path = require("path");

/**
 * SNAPSHOT INGESTION GATE
 * - read-only ingestion
 * - no execution rights
 * - feeds kernel ledger + telemetry only
 */
function ingestSnapshot(snapshotPath) {
  if (!fs.existsSync(snapshotPath)) {
    throw new Error("SNAPSHOT_NOT_FOUND");
  }

  const stats = fs.statSync(snapshotPath);

  const record = {
    type: "SNAPSHOT_INGESTED",
    path: snapshotPath,
    size: stats.size,
    timestamp: Date.now()
  };

  return record;
}

module.exports = { ingestSnapshot };
