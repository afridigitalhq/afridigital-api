// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelSovereignPolicyLayer {
  constructor({ invariants = [] }) {
    this.invariants = [
      "SYS_CALL_GATE_ONLY_EXECUTION",
      "NO_DIRECT_LEDGER_MUTATION",
      "SIMULATION_IS_READONLY",
      "CONSENSUS_REQUIRED_FOR_EXECUTION",
      ...invariants
    ];

    this.thresholds = {
      maxRisk: 0.7,
      maxBlockRate: 0.6,
      maxLatencyMs: 2000
    };
  }

  validate(event, consensusResult) {
    // Rule 1: consensus must approve execution
    if (!consensusResult?.decision?.consensus) {
      return this._deny("CONSENSUS_REJECTED", "critical");
    }

    // Rule 2: enforce risk ceiling
    if (consensusResult.score > this.thresholds.maxRisk) {
      return this._deny("RISK_THRESHOLD_EXCEEDED", "high");
    }

    // Rule 3: invariant check
    if (event?.bypassSyscallGate) {
      return this._deny("INVARIANT_VIOLATION_SYS_CALL_GATE", "critical");
    }

    return {
      allowed: true,
      reason: "POLICY_APPROVED",
      severity: "low"
    };
  }

  evaluateSystemHealth(metrics) {
    const risk = metrics.risk || 0;
    const load = metrics.load || 0;

    return {
      stable: risk < this.thresholds.maxRisk && load < 0.8,
      risk,
      load,
      mode:
        risk > 0.6
          ? "PROTECTED"
          : risk > 0.3
          ? "CAUTION"
          : "NORMAL"
    };
  }

  _deny(reason, severity) {
    return {
      allowed: false,
      reason,
      severity
    };
  }
}

module.exports = { KernelSovereignPolicyLayer };
