// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelMetaGovernanceLayer {
  constructor({ kspl, kcp }) {
    this.kspl = kspl;
    this.kcp = kcp;

    this.limits = {
      maxStructuralChangesPerHour: 3,
      maxConfigChangesPerHour: 20,
      cooldownMs: 10 * 60 * 1000
    };

    this.history = [];
  }

  // Evaluate whether a proposed system change is allowed
  evaluateProposal(proposal) {
    const type = this._classify(proposal);

    // Rule 1: execution surface changes are blocked
    if (type === "EXECUTION_SURFACE_CHANGE") {
      return this._reject("EXECUTION_LAYER_LOCKED");
    }

    // Rule 2: check rate limits
    if (this._exceedsRateLimit(type)) {
      return this._reject("EVOLUTION_RATE_LIMIT_EXCEEDED");
    }

    // Rule 3: require KSPL alignment for structural change
    if (type === "STRUCTURAL_CHANGE" && !this.kspl) {
      return this._reject("KSPL_REQUIRED");
    }

    return {
      allowed: true,
      type,
      reason: "META_APPROVED"
    };
  }

  // Determine proposal category
  _classify(p) {
    if (p.affectsExecutionSurface) return "EXECUTION_SURFACE_CHANGE";
    if (p.affectsStructure) return "STRUCTURAL_CHANGE";
    if (p.affectsPolicy) return "POLICY_CHANGE";
    return "CONFIG_CHANGE";
  }

  _exceedsRateLimit(type) {
    const now = Date.now();

    this.history = this.history.filter(
      h => now - h.time < this.limits.cooldownMs
    );

    const count = this.history.filter(h => h.type === type).length;

    return count > this.limits.maxConfigChangesPerHour;
  }

  _reject(reason) {
    return {
      allowed: false,
      reason,
      severity: "critical"
    };
  }

  recordChange(type) {
    this.history.push({
      type,
      time: Date.now()
    });
  }
}

module.exports = { KernelMetaGovernanceLayer };
