const { assertApiVersion } = require("../runtime/safety/api.guard");
const CRDTLedger = require('../crdt/v34.crdt.ledger');
const SyncEngine = require('../sync/v34.sync.engine');
const EventLog = require('../distributed/event.log');

class V34ClusterEngine {
  constructor() {
    this.crdt = new CRDTLedger();
    this.sync = new SyncEngine(this.crdt);
  }

  topUp(userId, amount) {
    return this.sync.emit({
      type: "CREDIT",
      userId,
      amount
    });
  }

  withdraw(userId, amount) {
    return this.sync.emit({
      type: "DEBIT",
      userId,
      amount
    });
  }

  internalTransfer(a, b, amount) {
    this.sync.emit({ type: "DEBIT", userId: a, amount });
    this.sync.emit({ type: "CREDIT", userId: b, amount });

    return "CRDT_COMMITTED";
  }

  mergeRemoteState(state) {
    return this.sync.sync(state);
  }

  getSnapshot() {
    return {
      crdt: this.crdt.snapshot(),
      events: EventLog.replay()
    };
  }
}

module.exports = new V34ClusterEngine();
