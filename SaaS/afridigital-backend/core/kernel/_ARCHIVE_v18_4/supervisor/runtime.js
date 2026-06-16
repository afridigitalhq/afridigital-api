class Supervisor {
  constructor() {
    this.status = "HEALTHY";
    this.failures = 0;
  }

  report(error) {
    this.failures++;

    if (this.failures > 3) {
      this.status = "DEGRADED";
    }

    console.error("🧠 SUPERVISOR ALERT:", error.message);
  }

  health() {
    return {
      status: this.status,
      failures: this.failures
    };
  }
}

module.exports = { Supervisor };
