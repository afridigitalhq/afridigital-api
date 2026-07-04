export class SOCFederationGovernance {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.nodeProfiles = new Map();
  }

  registerNode(nodeId) {
    this.nodeProfiles.set(nodeId, {
      trust: 1.0,
      stability: 1.0,
      accuracy: 1.0,
      cycles: 0
    });
  }

  updateNodeScore(nodeId, metrics) {
    const node = this.nodeProfiles.get(nodeId);
    if (!node) return;

    node.cycles += 1;

    node.accuracy = this._blend(node.accuracy, metrics.accuracy || 1);
    node.stability = this._blend(node.stability, metrics.stability || 1);

    node.trust = (node.accuracy + node.stability) / 2;

    this.nodeProfiles.set(nodeId, node);

    this.eventBus.emit("SOC_NODE_SCORE_UPDATED", { nodeId, node });
  }

  weightConsensus(results) {
    let totalWeight = 0;
    let weightedRisk = 0;

    for (const r of results) {
      const profile = this.nodeProfiles.get(r.nodeId) || { trust: 1 };
      const weight = profile.trust;

      weightedRisk += (r.cycle?.prediction?.riskScore || 0) * weight;
      totalWeight += weight;
    }

    const consensusRisk = totalWeight ? weightedRisk / totalWeight : 0;

    return {
      consensusRisk,
      nodeCount: results.length
    };
  }

  detectInstability(results) {
    const risks = results.map(r => r.cycle?.prediction?.riskScore || 0);
    const spread = Math.max(...risks) - Math.min(...risks);

    return {
      unstable: spread > 0.5,
      spread
    };
  }

  _blend(oldVal, newVal) {
    return (oldVal * 0.7) + (newVal * 0.3);
  }
}

export const createFederationGovernance = (bus) => {
  return new SOCFederationGovernance(bus);
};
