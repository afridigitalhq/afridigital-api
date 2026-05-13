class FinalityEngine {
  constructor() {
    this.pending = new Map(); // userId -> lock
  }

  lock(userId) {
    if (this.pending.get(userId)) {
      return false; // blocked (prevents double spend)
    }
    this.pending.set(userId, true);
    return true;
  }

  unlock(userId) {
    this.pending.delete(userId);
  }

  wrap(userId, fn) {
    if (!this.lock(userId)) {
      throw new Error("TRANSACTION_LOCKED");
    }

    try {
      return fn();
    } finally {
      this.unlock(userId);
    }
  }
}

module.exports = new FinalityEngine();
