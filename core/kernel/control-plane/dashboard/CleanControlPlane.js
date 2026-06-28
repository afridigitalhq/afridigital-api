// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * Clean Control Plane (READ-ONLY)
 * No kernel mutation, no dispatch access.
 */

class CleanControlPlane {
  constructor({ telemetry, ledger, replay }) {
    this.telemetry = telemetry;
    this.ledger = ledger;
    this.replay = replay;
  }

  getSystemSnapshot() {
    return {
      health: this.telemetry?.snapshot?.() || {},
      events: this.ledger?.count?.() || 0,
      status: "READ_ONLY_CONTROL_PLANE"
    };
  }

  getTimeline() {
    return this.replay?.timeline?.() || [];
  }

  getDiagnostics() {
    return {
      anomalies: this.telemetry?.anomalies?.() || [],
      warnings: this.telemetry?.warnings?.() || []
    };
  }
}

module.exports = { CleanControlPlane };
