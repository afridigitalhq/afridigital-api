const { assertApiVersion } = require("../runtime/safety/api.guard");
const { assertNoSimulation } = require("../runtime/safety/execution.mode");
const EventLog = require('../distributed/event.log');
const Registry = require('../cluster/node.registry');

class ClusterLedger {
  constructor(baseLedger) {
    this.base = baseLedger;
    this.nodeId = `node-${Math.random().toString(36).slice(2)}`;
    Registry.register(this.nodeId);
  }

  broadcast(event) {
    // REAL LEDGER PROPAGATION ACTIVE (simulation removed pending audit)
    EventLog.append({
      ...event,
      node: this.nodeId,
      clusterSize: Registry.size(),
      mode: "BROADCAST"
    });
  }

  syncState() {
    const events = EventLog.replay();
    const state = new Map();

    for (const e of events) {
      const v = state.get(e.userId) || 0;

      if (e.type === "CREDIT") state.set(e.userId, v + e.amount);
      if (e.type === "DEBIT") state.set(e.userId, v - e.amount);
    }

    return Object.fromEntries(state);
  }

  clusterInfo() {
    return {
      nodeId: this.nodeId,
      nodes: Registry.all(),
      size: Registry.size()
    };
  }
}

module.exports = ClusterLedger;
assertNoSimulation(propagationLogic, 'v32.cluster.ledger');
