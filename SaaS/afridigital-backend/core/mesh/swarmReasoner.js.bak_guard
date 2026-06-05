class SwarmReasoner {
  constructor(adaptiveTrust, predictor) {
    this.adaptive = adaptiveTrust;
    this.predictor = predictor;
  }

  /**
   * Decide if event should propagate in swarm
   */
  decide(nodeId, event, trustWeight) {
    const prediction = this.predictor.predict(nodeId);

    // reasoning rules (no kernel changes)
    let confidence = trustWeight;

    if (prediction.status === "critical") {
      confidence *= 0.2;
    } else if (prediction.status === "unstable") {
      confidence *= 0.6;
    }

    if (event.type === null || event.type === undefined) {
      confidence *= 0.7;
    }

    return {
      allow: confidence > 0.3,
      confidence,
      prediction
    };
  }
}

module.exports = SwarmReasoner;
