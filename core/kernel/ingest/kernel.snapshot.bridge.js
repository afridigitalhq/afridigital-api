const { ingestSnapshot } = require("./snapshot.ingestor");

/**
 * KERNEL SNAPSHOT BRIDGE
 * - converts afribksync output into kernel events
 * - NO EXECUTION
 * - ONLY EVENT EMISSION
 */
class SnapshotKernelBridge {
  constructor({ ledger }) {
    this.ledger = ledger;
  }

  ingest(snapshotPath) {
    const event = ingestSnapshot(snapshotPath);

    if (this.ledger?.append) {
      this.ledger.append(event);
    }

    return {
      status: "INGESTED",
      event
    };
  }
}

module.exports = { SnapshotKernelBridge };
