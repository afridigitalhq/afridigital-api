const { assertApiVersion } = require("../runtime/safety/api.guard");
class CRDTLedger {
  constructor() {
    this.state = new Map();
    this.vectorClock = new Map();
  }

  _tick(node) {
    const v = this.vectorClock.get(node) || 0;
    this.vectorClock.set(node, v + 1);
    return v + 1;
  }

  apply(node, op) {
    const ts = this._tick(node);
    const key = `${op.userId}`;

    const current = this.state.get(key) || 0;

    if (op.type === "CREDIT") {
      this.state.set(key, current + op.amount);
    }

    if (op.type === "DEBIT") {
      this.state.set(key, current - op.amount);
    }

    return { ts, state: this.state.get(key) };
  }

  merge(remoteState) {
    for (const [k, v] of Object.entries(remoteState)) {
      const local = this.state.get(k) || 0;
      this.state.set(k, Math.max(local, v));
    }
  }

  snapshot() {
    return Object.fromEntries(this.state);
  }
}

module.exports = CRDTLedger;
