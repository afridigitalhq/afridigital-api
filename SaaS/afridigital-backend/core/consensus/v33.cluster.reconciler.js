const { assertApiVersion } = require("../runtime/safety/api.guard");
const Registry = require('../cluster/node.registry');
const ForkResolver = require('../reconciliation/v33.fork.resolver');
const EventLog = require('../distributed/event.log');

class ClusterReconciler {
  constructor(base) {
    this.base = base;
  }

  auditCluster(nodeSnapshots) {
    const lastEvents = EventLog.replay();

    const forkReport = ForkResolver.detectFork(lastEvents);
    const driftReport = ForkResolver.detectInconsistency(nodeSnapshots);

    return {
      forks: forkReport,
      drift: driftReport
    };
  }

  autoRepair() {
    const events = EventLog.replay();
    const cleaned = ForkResolver.resolve(events);

    // rebuild truth from clean events
    const state = new Map();

    for (const e of cleaned) {
      const v = state.get(e.userId) || 0;

      if (e.type === "CREDIT") state.set(e.userId, v + e.amount);
      if (e.type === "DEBIT") state.set(e.userId, v - e.amount);
    }

    return {
      repairedState: Object.fromEntries(state),
      cleanedEvents: cleaned.length,
      nodes: Registry.all()
    };
  }
}

module.exports = ClusterReconciler;
