const { assertApiVersion } = require("../runtime/safety/api.guard");
class TxManager {
  constructor() {
    this.active = null;
  }

  begin() {
    this.active = { ops: [], status: "OPEN" };
    return this.active;
  }

  record(op) {
    if (!this.active) throw new Error("NO_ACTIVE_TX");
    this.active.ops.push(op);
  }

  commit() {
    if (!this.active) throw new Error("NO_ACTIVE_TX");
    this.active.status = "COMMITTED";
    const tx = this.active;
    this.active = null;
    return tx;
  }

  rollback() {
    if (!this.active) throw new Error("NO_ACTIVE_TX");
    this.active.status = "ROLLED_BACK";
    this.active = null;
  }
}

module.exports = new TxManager();
