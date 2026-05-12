const { assertApiVersion } = require("../runtime/safety/api.guard");
const Base = require('../../finance/ledger.engine');
const ClusterLedger = require('../consensus/v32.cluster.ledger');
const Reconciler = require('../consensus/v33.cluster.reconciler');
const EventLog = require('../distributed/event.log');

class FinanceClusterV33 {
  constructor() {
    this.base = new Base();
    this.cluster = new ClusterLedger(this.base);
    this.reconciler = new Reconciler(this.base);
    this.seenOps = new Set();
  }

  isDuplicate(opId) {
    if (this.seenOps.has(opId)) return true;
    this.seenOps.add(opId);
    return false;
  }

  topUp(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const res = this.base.credit(userId, amount, { opId });

    EventLog.append({ type: "CREDIT", userId, amount, opId });

    return res;
  }

  withdraw(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const res = this.base.debit(userId, amount, { opId });

    EventLog.append({ type: "DEBIT", userId, amount, opId });

    return res;
  }

  internalTransfer(a, b, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    this.base.debit(a, amount);
    this.base.credit(b, amount);

    EventLog.append({
      type: "TRANSFER",
      from: a,
      to: b,
      amount,
      opId
    });

    return "COMMITTED";
  }

  audit(nodes) {
    return this.reconciler.auditCluster(nodes);
  }

  repair() {
    return this.reconciler.autoRepair();
  }

  getSnapshot() {
    return {
      ledger: this.base.snapshot(),
      cluster: this.cluster.clusterInfo(),
      events: EventLog.replay()
    };
  }
}

module.exports = new FinanceClusterV33();
