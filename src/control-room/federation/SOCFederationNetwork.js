export class SOCFederationNetwork {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.nodes = new Map();
    this.history = [];
  }

  registerNode(nodeId, orchestrator) {
    this.nodes.set(nodeId, {
      orchestrator,
      score: 1.0,
      lastCycle: null
    });
  }

  broadcast(context) {
    const results = [];

    for (const [nodeId, node] of this.nodes.entries()) {
      const cycle = node.orchestrator.tick(context);

      node.lastCycle = cycle;

      results.push({
        nodeId,
        cycle
      });
    }

    const consensus = this._buildConsensus(results);

    const federationState = {
      timestamp: Date.now(),
      nodes: results,
      consensus
    };

    this.history.push(federationState);

    this.eventBus.emit("SOC_FEDERATION_CYCLE", federationState);

    return federationState;
  }

  _buildConsensus(results) {
    if (!results.length) return null;

    const riskAvg = results.reduce((sum, r) => {
      return sum + (r.cycle?.prediction?.riskScore || 0);
    }, 0) / results.length;

    const decisions = results.map(r => r.cycle?.decision).filter(Boolean);

    return {
      avgRisk: riskAvg,
      majorityDecision: this._majorityVote(decisions)
    };
  }

  _majorityVote(decisions) {
    const map = new Map();

    for (const d of decisions) {
      const key = d?.type || "UNKNOWN";
      map.set(key, (map.get(key) || 0) + 1);
    }

    return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
  }
}

export const createFederationNetwork = (bus) => {
  return new SOCFederationNetwork(bus);
};
