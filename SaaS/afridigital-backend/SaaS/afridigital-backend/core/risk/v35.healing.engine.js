const { assertApiVersion } = require("../runtime/safety/api.guard");
const GraphEngine = require("./v35.graph.engine");

class HealingEngineV35_5 {
  constructor() {
    this.recoveryMap = new Map(); // userId -> recovery score
  }

  update(userId) {
    const profile = GraphEngine.memory?.get(userId);

    let current = this.recoveryMap.get(userId) || 100;

    if (!profile) return { userId, status: "NO_DATA" };

    // healing logic: stable behavior reduces risk
    current += 5;

    if (profile.avgRisk > 60) {
      current -= 10;
    }

    current = Math.max(0, Math.min(100, current));
    this.recoveryMap.set(userId, current);

    return {
      userId,
      recoveryScore: current,
      status: current > 70 ? "SAFE" : "WATCH"
    };
  }

  shouldRelease(userId) {
    return (this.recoveryMap.get(userId) || 0) > 80;
  }
}

module.exports = new HealingEngineV35_5();
