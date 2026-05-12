const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require("crypto");

// optional vector engine hook (safe fallback if missing)
let VectorEngine = null;
try {
  VectorEngine = require("../../workers/vector-engine");
} catch (e) {
  VectorEngine = null;
}

class FraudEngineV35ML {
  constructor() {
    this.memory = new Map(); // user behavioral profiles
    this.signals = [];
    this.blacklist = new Set();
  }

  // -----------------------------
  // FEATURE EXTRACTION LAYER
  // -----------------------------
  extractFeatures(signal) {
    return {
      amount: signal.amount || 0,
      isDebit: signal.type === "DEBIT" ? 1 : 0,
      isCredit: signal.type === "CREDIT" ? 1 : 0,
      highValue: signal.amount > 10000 ? 1 : 0,
      geoRisk: signal.geoRisk ? 1 : 0,
      deviceMismatch: signal.deviceMismatch ? 1 : 0,
      hour: new Date().getHours(),
      userIdHash: this.hash(signal.userId)
    };
  }

  hash(v) {
    return crypto.createHash("sha256").update(String(v)).digest("hex");
  }

  // -----------------------------
  // VECTOR MEMORY UPDATE
  // -----------------------------
  learnVector(features) {
    if (!VectorEngine) return;

    try {
      VectorEngine.store({
        type: "FRAUD_SIGNAL",
        vector: Object.values(features),
        ts: Date.now()
      });
    } catch (e) {
      // fail silently for resilience
    }
  }

  // -----------------------------
  // SIMPLE ML-LIKE SCORING MODEL
  // (heuristic weighted model)
  // -----------------------------
  predict(features) {
    let score = 0;

    // learned behavior weights (pseudo-model)
    score += features.highValue * 30;
    score += features.deviceMismatch * 35;
    score += features.geoRisk * 25;
    score += features.isDebit * 10;

    // time anomaly (night activity risk)
    if (features.hour < 5 || features.hour > 23) {
      score += 10;
    }

    return Math.min(100, score);
  }

  // -----------------------------
  // MEMORY PROFILING
  // -----------------------------
  updateProfile(userId, features, score) {
    if (!this.memory.has(userId)) {
      this.memory.set(userId, { avgRisk: 0, count: 0 });
    }

    const profile = this.memory.get(userId);
    profile.avgRisk = (profile.avgRisk * profile.count + score) / (profile.count + 1);
    profile.count += 1;

    this.memory.set(userId, profile);
  }

  // -----------------------------
  // DECISION ENGINE
  // -----------------------------
  evaluate(signal) {
    const features = this.extractFeatures(signal);
    const riskScore = this.predict(features);

    this.learnVector(features);
    this.updateProfile(signal.userId, features, riskScore);

    let decision = "ALLOW";

    if (riskScore >= 80) {
      decision = "BLOCK";
      this.blacklist.add(signal.userId);
    } else if (riskScore >= 50) {
      decision = "REVIEW";
    }

    const result = {
      userId: signal.userId,
      riskScore,
      decision,
      features,
      ts: Date.now()
    };

    this.signals.push(result);
    return result;
  }

  // -----------------------------
  // GLOBAL INSIGHTS
  // -----------------------------
  getInsights() {
    return {
      blacklistSize: this.blacklist.size,
      totalSignals: this.signals.length,
      usersTracked: this.memory.size
    };
  }

  getUserProfile(userId) {
    return this.memory.get(userId) || null;
  }
}

module.exports = new FraudEngineV35ML();
