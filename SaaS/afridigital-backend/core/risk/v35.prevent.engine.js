const { assertApiVersion } = require("../runtime/safety/api.guard");
const GraphEngine = require("./v35.graph.engine");

class PreventEngineV35_4 {
  constructor() {
    this.blocklist = new Set();
  }

  // PREVENT EDGE FORMATION BEFORE IT EXISTS
  intercept(tx) {
    const risk = GraphEngine.evaluate(tx.userId);

    if (risk.riskScore >= 70) {
      this.blocklist.add(tx.userId);

      return {
        allowed: false,
        reason: "PREVENTIVE_BLOCK",
        score: risk.riskScore
      };
    }

    return { allowed: true };
  }

  isBlocked(userId) {
    return this.blocklist.has(userId);
  }
}

module.exports = new PreventEngineV35_4();
