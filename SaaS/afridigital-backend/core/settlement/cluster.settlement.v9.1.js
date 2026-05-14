const hub = require("../realtime/event.hub");
const local = require("./settlement.v9.js");

/**
 * V9.1 DISTRIBUTED SETTLEMENT LAYER
 * - multi-node replication simulation
 * - cluster finality
 * - settlement broadcast
 */

class ClusterSettlementV9_1 {

  constructor() {

    this.nodes = ["nodeA", "nodeB", "nodeC"];
    this.replicationLog = [];
    this.consensusThreshold = 2; // 2 of 3 nodes
  }

  broadcast(event) {

    const ack = [];

    for (const node of this.nodes) {

      ack.push({
        node,
        status: "ACK",
        ts: Date.now()
      });
    }

    this.replicationLog.push({
      event,
      ack
    });

    hub.emitEvent({
      type: "cluster.broadcast",
      event,
      ack
    });

    return ack;
  }

  proposeSettlement(tx) {

    const begin = local.begin(tx);

    if (!begin.ok) {
      return begin;
    }

    const votes = [];

    for (let i = 0; i < this.nodes.length; i++) {

      const vote = {
        node: this.nodes[i],
        approve: tx.amount < 1000000, // simple safety rule
        ts: Date.now()
      };

      votes.push(vote);
    }

    const approvals =
      votes.filter(v => v.approve).length;

    if (approvals < this.consensusThreshold) {

      hub.emitEvent({
        type: "cluster.rejected",
        tx,
        approvals
      });

      return {
        ok: false,
        status: "REJECTED_BY_CLUSTER",
        approvals
      };
    }

    const execution = local.execute(begin.id);

    if (!execution.ok) {

      return {
        ok: false,
        status: "EXECUTION_FAILED",
        error: execution.error
      };
    }

    this.broadcast({
      tx,
      result: execution
    });

    return {
      ok: true,
      status: "FINALIZED_CLUSTER",
      approvals,
      execution
    };
  }

  snapshot() {

    return {
      ok: true,
      nodes: this.nodes.length,
      logs: this.replicationLog.length,
      consensusThreshold: this.consensusThreshold
    };
  }
}

module.exports = new ClusterSettlementV9_1();
