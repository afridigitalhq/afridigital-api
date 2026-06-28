// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class AdaptiveGovernor {
  constructor(baseGovernor) {
    this.governor = baseGovernor;

    this.metrics = {
      blocked: 0,
      allowed: 0,
      loadHistory: []
    };
  }

  record(result) {
    if (result.blocked) this.metrics.blocked++;
    else this.metrics.allowed++;
  }

  adjust() {
    const total = this.metrics.blocked + this.metrics.allowed;

    if (total < 10) return;

    const blockRate = this.metrics.blocked / total;

    // ONLY adjust thresholds (NO structural mutation)
    if (blockRate > 0.3) {
      this.governor.threshold += 10;
    }

    if (blockRate < 0.1 && this.governor.threshold > 20) {
      this.governor.threshold -= 5;
    }

    // reset window
    this.metrics.blocked = 0;
    this.metrics.allowed = 0;
  }

  evaluate(event) {
    const result = this.governor.evaluate(event);
    this.record(result);
    return result;
  }
}

module.exports = { AdaptiveGovernor };
