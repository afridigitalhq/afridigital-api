class FailurePredictor {
  constructor(adaptiveTrust) {
    this.adaptive = adaptiveTrust;
  }

  /**
   * Predict probability of node failure
   */
  predict(nodeId) {
    const profile = this.adaptive.profile.get(nodeId);

    if (!profile) {
      return { risk: 0.5, status: "unknown" };
    }

    const events = profile.events || 0;
    const anomalies = profile.anomalies || 0;
    const inactivity = Date.now() - (profile.lastSeen || Date.now());

    // heuristic model (lightweight swarm intelligence)
    let risk =
      (anomalies / Math.max(events, 1)) * 0.5 +
      (inactivity > 60000 ? 0.3 : 0) +
      (events < 10 ? 0.2 : 0);

    risk = Math.min(1, Math.max(0, risk));

    return {
      risk,
      status:
        risk > 0.7 ? "critical" :
        risk > 0.4 ? "unstable" :
        "healthy"
    };
  }

  /**
   * swarm-wide health scan
   */
  scan() {
    const nodes = this.adaptive.profile.keys();
    const report = {};

    for (const nodeId of nodes) {
      report[nodeId] = this.predict(nodeId);
    }

    return report;
  }
}

module.exports = FailurePredictor;
