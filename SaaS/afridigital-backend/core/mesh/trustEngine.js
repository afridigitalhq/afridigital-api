class TrustEngine {
  constructor() {
    this.scores = new Map(); // nodeId → trust score
  }

  initNode(nodeId) {
    if (!this.scores.has(nodeId)) {
      this.scores.set(nodeId, 1.0); // neutral trust
    }
  }

  get(nodeId) {
    return this.scores.get(nodeId) || 0.5;
  }

  /**
   * Increase trust if node behaves correctly
   */
  reward(nodeId, delta = 0.05) {
    this.initNode(nodeId);
    this.scores.set(nodeId, Math.min(1, this.get(nodeId) + delta));
  }

  /**
   * Penalize suspicious or conflicting behavior
   */
  penalize(nodeId, delta = 0.1) {
    this.initNode(nodeId);
    this.scores.set(nodeId, Math.max(0, this.get(nodeId) - delta));
  }

  /**
   * Weighted vote contribution
   */
  weight(nodeId) {
    return this.get(nodeId);
  }

  snapshot() {
    return Object.fromEntries(this.scores);
  }
}

module.exports = TrustEngine;
