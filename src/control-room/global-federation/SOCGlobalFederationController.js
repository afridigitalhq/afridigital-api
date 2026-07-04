export class SOCGlobalFederationController {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.federations = new Map();
  }

  registerFederation(id, federation) {
    this.federations.set(id, {
      federation,
      trust: 1.0
    });
  }

  broadcast(context) {
    const results = [];

    for (const [id, f] of this.federations.entries()) {
      const res = f.federation.broadcast(context);
      results.push({ id, res });
    }

    const global = this._buildGlobalConsensus(results);

    const packet = {
      timestamp: Date.now(),
      federations: results,
      global
    };

    this.eventBus.emit("SOC_GLOBAL_FEDERATION_CYCLE", packet);

    return packet;
  }

  _buildGlobalConsensus(results) {
    const allRisks = [];
    const decisions = [];

    for (const r of results) {
      const c = r.res?.consensus;
      if (c?.avgRisk != null) allRisks.push(c.avgRisk);
      if (c?.majorityDecision) decisions.push(c.majorityDecision);
    }

    const avgRisk = allRisks.length
      ? allRisks.reduce((a,b)=>a+b,0) / allRisks.length
      : 0;

    return {
      globalRisk: avgRisk,
      globalDecision: this._majority(decisions),
      stability: this._stability(allRisks)
    };
  }

  _majority(arr) {
    const map = new Map();
    for (const v of arr) {
      map.set(v, (map.get(v)||0)+1);
    }
    return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
  }

  _stability(risks) {
    if (!risks.length) return "UNKNOWN";
    const spread = Math.max(...risks) - Math.min(...risks);
    return spread > 0.4 ? "UNSTABLE" : "STABLE";
  }
}

export const createGlobalFederationController = (bus) => {
  return new SOCGlobalFederationController(bus);
};
