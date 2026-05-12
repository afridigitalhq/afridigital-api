const { assertApiVersion } = require("../runtime/safety/api.guard");
const EventLog = require('../distributed/event.log');

class SyncEngine {
  constructor(crdt) {
    this.crdt = crdt;
    this.nodeId = `node-${Math.random().toString(36).slice(2)}`;
  }

  emit(op) {
    const result = this.crdt.apply(this.nodeId, op);

    EventLog.append({
      ...op,
      node: this.nodeId,
      ts: result.ts
    });

    return result;
  }

  sync(remoteSnapshot) {
    this.crdt.merge(remoteSnapshot);
    return this.crdt.snapshot();
  }

  exportState() {
    return this.crdt.snapshot();
  }
}

module.exports = SyncEngine;
