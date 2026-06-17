const rateLimiter = require("./rateLimiter");
const breaker = require("./circuitBreaker");

module.exports = {
  preCheck(event) {
    const rl = rateLimiter.allow(event.from || event.user);

    if (!rl.ok) {
      return { ok: false, reason: rl.reason };
    }

    if (!breaker.allow()) {
      return { ok: false, reason: "circuit_open" };
    }

    return { ok: true };
  },

  success() {
    breaker.recordSuccess();
  },

  failure() {
    breaker.recordFailure();
  }
};
