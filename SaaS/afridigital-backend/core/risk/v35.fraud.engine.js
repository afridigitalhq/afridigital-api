const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require("crypto");

class FraudEngineV35 {
  constructor() {
    this.rules = [];
    this.signals = [];
    this.blacklist = new Set();
  }

  // -----------------------------
  // SIGNAL INGESTION
  // -----------------------------
  ingest(signal) {
    const enriched = {
      ...signal,
      ts: Date.now(),
      hash: crypto.createHash("sha256")
        .update(JSON.stringify(signal))
        .digest("hex")
    };

    this.signals.push(enriched);
    return enriched;
  }

  // -----------------------------
  // SIMPLE RISK SCORING MODEL
  // -----------------------------
  score(signal) {
    let score = 0;

    if (this.blacklist.has(signal.userId)) {
      score += 80;
    }

    if (signal.amount > 10000) {
      score += 30;
    }

    if (signal.type === "DEBIT") {
      score += 10;
    }

    if (signal.geoRisk === true) {
      score += 25;
    }

    if (signal.deviceMismatch === true) {
      score += 35;
    }

    return Math.min(100, score);
  }

  // -----------------------------
  // DECISION ENGINE
  // -----------------------------
  evaluate(signal) {
    const enriched = this.ingest(signal);
    const risk = this.score(enriched);

    let decision = "ALLOW";

    if (risk >= 80) decision = "BLOCK";
    else if (risk >= 50) decision = "REVIEW";

    const result = {
      userId: signal.userId,
      risk,
      decision,
      signalId: enriched.hash,
      ts: enriched.ts
    };

    this.applyAction(result);
    return result;
  }

  // -----------------------------
  // ACTION LAYER
  // -----------------------------
  applyAction(result) {
    if (result.decision === "BLOCK") {
      this.blacklist.add(result.userId);
    }
  }

  // -----------------------------
  // ADMIN UTILITIES
  // -----------------------------
  whitelist(userId) {
    this.blacklist.delete(userId);
    return { userId, status: "WHITELISTED" };
  }

  getSignals(limit = 50) {
    return this.signals.slice(-limit);
  }

  getStatus() {
    return {
      blacklistSize: this.blacklist.size,
      signalCount: this.signals.length
    };
  }
}

module.exports = new FraudEngineV35();
