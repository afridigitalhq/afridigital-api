const { assertApiVersion } = require("../runtime/safety/api.guard");
class StateStore {
  constructor() {
    this.committed = new Map();
    this.pending = new Map();
  }

  stage(txId, tx) {
    this.pending.set(txId, {
      ...tx,
      status: "PENDING"
    });
  }

  commit(txId) {
    const tx = this.pending.get(txId);
    if (!tx) return null;

    this.committed.set(txId, {
      ...tx,
      status: "COMMITTED",
      committedAt: Date.now()
    });

    this.pending.delete(txId);
    return this.committed.get(txId);
  }

  rollback(txId, reason = "MANUAL") {
    const tx = this.committed.get(txId);
    if (!tx) return null;

    this.committed.set(txId, {
      ...tx,
      status: "ROLLED_BACK",
      reason
    });

    return this.committed.get(txId);
  }

  snapshot() {
    return {
      committed: Object.fromEntries(this.committed),
      pending: Object.fromEntries(this.pending)
    };
  }
}

module.exports = new StateStore();
