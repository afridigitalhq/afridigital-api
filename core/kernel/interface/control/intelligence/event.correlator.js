// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * UNIFIED EVENT CORRELATOR
 * Cross-layer causality engine (read-only)
 */

class EventCorrelator {
  constructor({ telemetry, ledger, fault, replay }) {
    this.telemetry = telemetry;
    this.ledger = ledger;
    this.fault = fault;
    this.replay = replay;
  }

  correlate() {
    return {
      causalGraph: this._buildCausalGraph(),
      hotspots: this._findHotspots(),
      dependencies: this._mapDependencies()
    };
  }

  _buildCausalGraph() {
    const events = this.ledger?.events?.() || [];
    return events.map((e, i) => ({
      id: e.id,
      linksTo: events[i + 1]?.id || null
    }));
  }

  _findHotspots() {
    return this.fault?.hotspots?.() || [];
  }

  _mapDependencies() {
    return this.replay?.dependencyMap?.() || {};
  }
}

module.exports = { EventCorrelator };
