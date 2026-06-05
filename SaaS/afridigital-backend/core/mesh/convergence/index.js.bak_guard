const VectorClock = require('../vclock');
const CRDTState = require('../crdt');

class ConvergenceEngine {
  constructor() {
    this.vclock = new VectorClock();
    this.crdt = new CRDTState();
  }

  ingest(nodeId, event) {
    const clock = this.vclock.tick(nodeId);

    if (event.type && event.payload) {
      this.crdt.apply(event.type, {
        value: event.payload,
        ts: Date.now(),
        clock
      });
    }

    return {
      clock,
      state: this.crdt.get()
    };
  }

  reconcile(remoteState) {
    this.crdt.merge(remoteState);
    return this.crdt.get();
  }
}

module.exports = ConvergenceEngine;
