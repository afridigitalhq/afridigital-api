// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelGovernor {
  constructor() {
    this.load = 0;
    this.threshold = 100;
    this.cooldown = false;
  }

  evaluate(event) {
    this.load++;

    const risk = this._riskScore(event);

    if (this.cooldown) {
      return { allow: false, reason: "COOLDOWN_ACTIVE" };
    }

    if (this.load > this.threshold || risk > 0.8) {
      this.cooldown = true;

      setTimeout(() => {
        this.cooldown = false;
        this.load = 0;
      }, 2000);

      return { allow: false, reason: "GOVERNOR_THROTTLE" };
    }

    return { allow: true };
  }

  _riskScore(event) {
    // simple heuristic: prediction instability or unknown types
    if (!event) return 1;

    let score = 0;

    if (!event.type) score += 0.5;
    if (event.prediction?.confidence < 0.3) score += 0.3;

    return Math.min(1, score);
  }
}

module.exports = { KernelGovernor };
