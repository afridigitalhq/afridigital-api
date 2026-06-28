// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class TelemetrySovereignty {
  constructor({ ledger, governor }) {
    this.ledger = ledger;
    this.governor = governor;

    this.metrics = {
      events: 0,
      blocked: 0,
      anomalies: 0
    };
  }

  observe(eventResult) {
    this.metrics.events++;

    if (eventResult?.blocked) {
      this.metrics.blocked++;
    }

    if (eventResult?.reason === "GOVERNOR_THROTTLE") {
      this.metrics.anomalies++;
    }

    this.ledger?.append?.({
      type: "telemetry_snapshot",
      metrics: this.metrics,
      timestamp: Date.now()
    });
  }

  report() {
    const healthScore =
      1 -
      (this.metrics.blocked / Math.max(1, this.metrics.events));

    return {
      healthScore,
      metrics: this.metrics,
      status:
        healthScore > 0.8
          ? "STABLE"
          : healthScore > 0.5
          ? "DEGRADED"
          : "UNSTABLE"
    };
  }
}

module.exports = { TelemetrySovereignty };
