#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/fraud/fraud.engine.cjs"

cat > "$FILE" << 'JS'
class FraudEngine {
  constructor() {
    this.baseThreshold = 70;

    if (!global.__FRAUD_STATE__) {
      global.__FRAUD_STATE__ = {
        shortTerm: new Map(),
        longTerm: new Map(),
        graph: new Map(),
        lastTime: new Map(),
        lockUntil: new Map(),
        userLock: new Map(),
        adaptiveThreshold: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;

    // 🧠 POLICY ENGINE (V15 CORE)
    this.policies = [
      { name: "PAYMENT_SPIKE", weight: 1.2 },
      { name: "TXN_FAIL_CHAIN", weight: 1.4 },
      { name: "UNAUTHORIZED_ACCESS", weight: 2.0 },
      { name: "SPAM_ACTIVITY", weight: 1.3 }
    ];
  }

  _base(event) {
    let s = 0;
    if (event.includes('PAYMENT')) s += 20;
    if (event.includes('TXN_FAIL')) s += 35;
    if (event.includes('RETRY')) s += 15;
    if (event.includes('WHATSAPP')) s += 20;
    if (event.includes('SPAM')) s += 45;
    if (event.includes('ERROR')) s += 30;
    if (event.includes('UNAUTHORIZED')) s += 60;
    return s;
  }

  _riskLevel(score, threshold) {
    if (score >= threshold * 1.6) return "CRITICAL";
    if (score >= threshold) return "HIGH";
    if (score >= threshold * 0.75) return "MEDIUM";
    return "LOW";
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const event = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let threshold = this.state.adaptiveThreshold.get(user) || this.baseThreshold;

    // decay threshold slightly over time
    if (delta > 30000) threshold *= 0.98;

    let base = this._base(event);

    // memory layers
    let short = this.state.shortTerm.get(user) || 0;
    let long = this.state.longTerm.get(user) || 0;

    short = delta < 2000 ? short + base * 1.4 : short * 0.75;
    long = long * 0.95 + base;

    // chain memory
    const chain = this.state.graph.get(user) || [];
    chain.push(event);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    // policy amplification
    let policyBoost = 1;
    const chainStr = trimmed.join('→');

    if (chainStr.includes('PAYMENT→TXN_FAIL')) policyBoost *= 1.3;
    if (chainStr.includes('TXN_FAIL→UNAUTHORIZED')) policyBoost *= 1.7;
    if (chainStr.includes('PAYMENT→TXN_FAIL→UNAUTHORIZED')) policyBoost *= 2.2;

    const score = ((short * 0.6) + (long * 0.4)) * policyBoost;

    // persist state
    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);
    this.state.adaptiveThreshold.set(user, threshold);

    const lockUntil = this.state.lockUntil.get(user) || 0;

    // 🔒 active lock
    if (now < lockUntil) {
      return {
        action: "THROTTLE",
        risk: this._riskLevel(score, threshold),
        score: Math.round(score),
        user,
        event,
        retryAfter: lockUntil - now,
        safe: false,
        chain: trimmed
      };
    }

    // 🚨 HARD BLOCK
    if (score >= threshold * 1.6) {
      this.state.lockUntil.set(user, now + 20000);

      return {
        action: "BLOCK",
        risk: "CRITICAL",
        score: Math.round(score),
        cooldown: 20000,
        user,
        event,
        safe: false,
        chain: trimmed
      };
    }

    // ⚠️ THROTTLE
    if (score >= threshold) {
      this.state.lockUntil.set(user, now + 12000);

      return {
        action: "THROTTLE",
        risk: "HIGH",
        score: Math.round(score),
        cooldown: 12000,
        user,
        event,
        safe: false,
        chain: trimmed
      };
    }

    // 🟡 REVIEW
    if (score >= threshold * 0.75) {
      return {
        action: "REVIEW",
        risk: "MEDIUM",
        score: Math.round(score),
        user,
        event,
        safe: true,
        chain: trimmed
      };
    }

    // 🟢 SAFE
    return {
      action: "ALLOW",
      risk: "LOW",
      score: Math.round(score),
      user,
      event,
      safe: true,
      chain: trimmed
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V15 DEPLOYED (POLICY ENGINE + RISK CLASSIFIER)"
