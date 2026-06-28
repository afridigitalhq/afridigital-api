// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class ControlPlaneDashboard {
  constructor({ ledger }) {
    this.ledger = ledger;
    this.snapshots = [];
  }

  ingestTelemetry(entry) {
    this.snapshots.push(entry);

    if (this.snapshots.length > 500) {
      this.snapshots.shift();
    }
  }

  getLiveView() {
    const last = this.snapshots[this.snapshots.length - 1];

    return {
      status: last?.report?.status || "UNKNOWN",
      healthScore: last?.report?.healthScore || 0,
      events: this.snapshots.length,
      blocked: last?.report?.metrics?.blocked || 0,
      anomalies: last?.report?.metrics?.anomalies || 0
    };
  }

  getTimeline() {
    return this.snapshots.map(s => ({
      time: s.timestamp,
      health: s.report?.healthScore || 0,
      status: s.report?.status || "UNKNOWN"
    }));
  }

  getDAGView() {
    // simplified logical DAG representation
    return {
      nodes: [
        "SyscallGate",
        "Governor",
        "Consciousness",
        "ReactiveKernel",
        "Telemetry"
      ],
      edges: [
        ["SyscallGate", "Governor"],
        ["SyscallGate", "Consciousness"],
        ["Consciousness", "ReactiveKernel"],
        ["ReactiveKernel", "Telemetry"]
      ]
    };
  }
}

module.exports = { ControlPlaneDashboard };
