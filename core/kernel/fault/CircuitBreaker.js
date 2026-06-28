// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class CircuitBreaker {
  constructor({ threshold = 5, cooldownMs = 10000 }) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;

    this.failures = 0;
    this.state = "CLOSED"; // CLOSED | OPEN | HALF_OPEN
    this.lastFailure = null;
  }

  call(fn) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailure > this.cooldownMs) {
        this.state = "HALF_OPEN";
      } else {
        return { ok: false, reason: "CIRCUIT_OPEN" };
      }
    }

    try {
      const result = fn();

      this.failures = 0;
      this.state = "CLOSED";

      return { ok: true, result };
    } catch (e) {
      this.failures++;
      this.lastFailure = Date.now();

      if (this.failures >= this.threshold) {
        this.state = "OPEN";
      }

      return { ok: false, reason: "FAILURE_CAPTURED" };
    }
  }
}

module.exports = { CircuitBreaker };
