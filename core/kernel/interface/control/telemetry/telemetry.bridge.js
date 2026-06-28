// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * READ-ONLY TELEMETRY BRIDGE
 * Maps runtime signals → control plane contract
 */

class TelemetryBridge {
  constructor({ telemetryEngine, ledger, fault }) {
    this.telemetry = telemetryEngine;
    this.ledger = ledger;
    this.fault = fault;
  }

  getSystemSnapshot() {
    return {
      health: this.telemetry?.health?.() || "unknown",
      status: this.telemetry?.status?.() || "stable",
      uptime: this.telemetry?.uptime?.() || 0
    };
  }

  getEventMetrics() {
    return {
      eventCount: this.ledger?.count?.() || 0,
      eventRate: this.telemetry?.eventRate?.() || 0,
      queueDepth: this.telemetry?.queueDepth?.() || 0
    };
  }

  getTelemetryFeed() {
    return {
      anomalies: this.telemetry?.anomalies?.() || [],
      warnings: this.telemetry?.warnings?.() || [],
      forecast: this.telemetry?.forecast?.() || {}
    };
  }

  getDiagnostics() {
    return {
      errors: this.fault?.errors?.() || [],
      latency: this.telemetry?.latency?.() || 0,
      throttles: this.telemetry?.throttles?.() || 0
    };
  }
}

module.exports = { TelemetryBridge };
