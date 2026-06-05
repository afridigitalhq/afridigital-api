/**
 * 🧠 Adaptive Trust AI Layer (Overlay Only)
 * - Does NOT modify consensus engine
 * - Observes events
 * - Learns node behavior patterns
 */

class AdaptiveTrust {
  constructor(trustEngine, consensus) {
    this.trust = trustEngine;
    this.consensus = consensus;

    // behavior memory per node
    this.profile = new Map();
  }

  observe(event, nodeId) {
    if (!this.profile.has(nodeId)) {
      this.profile.set(nodeId, {
        events: 0,
        failures: 0,
        anomalies: 0,
        lastSeen: Date.now()
      });
    }

    const p = this.profile.get(nodeId);
    p.events++;
    p.lastSeen = Date.now();

    // heuristic anomaly detection (lightweight)
    if (!event || !event.type) {
      p.anomalies++;
      this.trust.penalize(nodeId, 0.1);
      return;
    }

    // detect suspicious repetition patterns
    if (p.events % 50 === 0 && p.anomalies > 5) {
      this.trust.penalize(nodeId, 0.2);
    }

    // reward stability over time
    if (p.events % 100 === 0 && p.anomalies < 2) {
      this.trust.reward(nodeId, 0.1);
    }
  }

  /**
   * periodic swarm evolution step
   */
  evolve() {
    for (const [nodeId, p] of this.profile.entries()) {
      const age = Date.now() - p.lastSeen;

      // decay trust if inactive or inconsistent
      if (age > 60000) {
        this.trust.penalize(nodeId, 0.05);
      }

      // strong anomaly penalty
      if (p.anomalies > p.events * 0.3) {
        this.trust.penalize(nodeId, 0.2);
      }
    }
  }

  snapshot() {
    return Object.fromEntries(this.profile);
  }
}

module.exports = AdaptiveTrust;
