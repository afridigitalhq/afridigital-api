const { assertApiVersion } = require("../runtime/safety/api.guard");
const Base = require('../../finance/ledger.engine');
const EventLog = require('../distributed/event.log');
const ClusterLedger = require('../consensus/v32.cluster.ledger');

class FinanceClusterKernel {
  constructor() {
    this.base = new Base();
    this.cluster = new ClusterLedger(this.base);
    this.seenOps = new Set();
  }

  isDuplicate(opId) {
    if (this.seenOps.has(opId)) return true;
    this.seenOps.add(opId);
    return false;
  }

  topUp(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const bal = this.base.credit(userId, amount, { opId, cluster: true });

    this.cluster.broadcast({
      type: "CREDIT",
      userId,
      amount,
      opId
    });

    return bal;
  }

  withdraw(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const bal = this.base.debit(userId, amount, { opId, cluster: true });

    this.cluster.broadcast({
      type: "DEBIT",
      userId,
      amount,
      opId
    });

    return bal;
  }

  internalTransfer(a, b, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    this.base.debit(a, amount);
    this.base.credit(b, amount);

    this.cluster.broadcast({
      type: "TRANSFER",
      from: a,
      to: b,
      amount,
      opId
    });

    return "CLUSTER_COMMITTED";
  }

  getClusterState() {
    return {
      ledger: this.base.snapshot(),
      cluster: this.cluster.clusterInfo(),
      sync: this.cluster.syncState()
    };
  }
}

module.exports = new FinanceClusterKernel();
