// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class FaultController {
  constructor() {
    this.mode = "NORMAL"; // NORMAL | DEGRADED | EMERGENCY
  }

  evaluate(systemHealth) {
    if (systemHealth.risk > 0.8) {
      this.mode = "EMERGENCY";
    } else if (systemHealth.risk > 0.5) {
      this.mode = "DEGRADED";
    } else {
      this.mode = "NORMAL";
    }

    return {
      mode: this.mode,
      action:
        this.mode === "EMERGENCY"
          ? "SHUTDOWN_NONCRITICAL"
          : this.mode === "DEGRADED"
          ? "LIMIT_THROUGHPUT"
          : "NORMAL_OPERATION"
    };
  }
}

module.exports = { FaultController };
