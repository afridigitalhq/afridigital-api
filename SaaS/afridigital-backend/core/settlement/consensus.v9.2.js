const hub = require("../realtime/event.hub");
const cluster = require("./cluster.settlement.v9.1.js");

/**
 * V9.2 FRAUD-AWARE CONSENSUS ENGINE
 * - weighted voting
 * - node trust scoring
 * - risk-based settlement control
 */

class ConsensusV9_2 {

  constructor() {

    this.nodeProfile = {
      nodeA: { trust: 0.95, fraudRisk: 0.1, liquidity: 0.9 },
      nodeB: { trust: 0.80, fraudRisk: 0.3, liquidity: 0.7 },
      nodeC: { trust: 0.60, fraudRisk: 0.6, liquidity: 0.5 }
    };

    this.highRiskThreshold = 0.65;
  }

  _scoreNode(node) {

    const p = this.nodeProfile[node];

    if (!p) return 0;

    // Weighted formula
    return (
      p.trust * 0.5 +
      (1 - p.fraudRisk) * 0.3 +
      p.liquidity * 0.2
    );
  }

  _transactionRisk(tx) {

    if (tx.amount > 500000) return 0.9;
    if (tx.amount > 100000) return 0.6;
    if (tx.amount > 10000) return 0.3;
    return 0.1;
  }

  propose(tx) {

    const risk = this._transactionRisk(tx);

    const votes = [];

    const nodes = Object.keys(this.nodeProfile);

    let weightedApproval = 0;
    let totalWeight = 0;

    for (const node of nodes) {

      const weight = this._scoreNode(node);

      const approve = (risk < this.highRiskThreshold);

      votes.push({ node, approve, weight });

      if (approve) weightedApproval += weight;

      totalWeight += weight;
    }

    const approvalRatio = weightedApproval / totalWeight;

    if (approvalRatio < 0.6) {

      hub.emitEvent({
        type: "consensus.rejected.v9_2",
        tx,
        risk,
        approvalRatio
      });

      return {
        ok: false,
        status: "REJECTED_BY_FRAUD_ENGINE",
        risk,
        approvalRatio
      };
    }

    const execution = cluster.proposeSettlement(tx);

    if (!execution.ok) {

      return {
        ok: false,
        status: "CLUSTER_EXECUTION_FAILED",
        execution
      };
    }

    hub.emitEvent({
      type: "consensus.approved.v9_2",
      tx,
      risk,
      approvalRatio
    });

    return {
      ok: true,
      status: "FINALIZED_VIA_FRAUD_ENGINE",
      risk,
      approvalRatio,
      execution
    };
  }

  snapshot() {

    return {
      ok: true,
      nodes: Object.keys(this.nodeProfile).length,
      highRiskThreshold: this.highRiskThreshold
    };
  }
}

module.exports = new ConsensusV9_2();
