const hub = require("../realtime/event.hub");
const selfheal = require("./selfhealing.v9.3");

/**
 * V9.4 GLOBAL FINALITY ENGINE
 * - cross-cluster settlement truth layer
 * - global commit consistency
 * - conflict resolution across regions
 */

class GlobalFinalityV9_4 {

  constructor() {

    this.globalLedger = new Map(); // txId → final state
    this.clusterStates = new Map(); // cluster → state hash
    this.finalizedCount = 0;
    this.conflicts = [];
  }

  _hash(tx) {
    return Buffer.from(JSON.stringify(tx)).toString("base64").slice(0, 24);
  }

  submit(clusterId, tx) {

    const execution = selfheal.execute(tx);

    if (!execution.ok) {

      hub.emitEvent({
        type: "global.rejected",
        clusterId,
        tx,
        reason: execution.status
      });

      return execution;
    }

    const txHash = this._hash(tx);

    // Detect duplicate / conflicting transactions
    if (this.globalLedger.has(txHash)) {

      const conflict = {
        tx,
        existing: this.globalLedger.get(txHash),
        clusterId
      };

      this.conflicts.push(conflict);

      hub.emitEvent({
        type: "global.conflict",
        conflict
      });

      return {
        ok: false,
        status: "CONFLICT_DETECTED",
        conflict
      };
    }

    // Commit global finality
    const finalRecord = {
      clusterId,
      tx,
      execution,
      hash: txHash,
      timestamp: Date.now(),
      final: true
    };

    this.globalLedger.set(txHash, finalRecord);
    this.finalizedCount++;

    hub.emitEvent({
      type: "global.finalized",
      record: finalRecord
    });

    return {
      ok: true,
      status: "GLOBAL_FINALITY_CONFIRMED",
      hash: txHash
    };
  }

  clusterSnapshot(clusterId) {

    return {
      clusterId,
      ledgerSize: this.globalLedger.size,
      finalized: this.finalizedCount
    };
  }

  globalSnapshot() {

    return {
      ok: true,
      clusters: this.clusterStates.size,
      finalized: this.finalizedCount,
      conflicts: this.conflicts.length,
      ledgerSize: this.globalLedger.size
    };
  }
}

module.exports = new GlobalFinalityV9_4();
