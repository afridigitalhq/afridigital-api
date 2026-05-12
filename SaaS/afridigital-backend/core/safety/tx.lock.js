const { assertApiVersion } = require("../runtime/safety/api.guard");
class TxLock {
  constructor() {
    this.locked = new Set();
  }

  acquire(key) {
    if (this.locked.has(key)) throw new Error("TX_LOCKED");
    this.locked.add(key);
  }

  release(key) {
    this.locked.delete(key);
  }
}

module.exports = new TxLock();
