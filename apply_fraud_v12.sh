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
        lockUntil: new Map(),
        lastTime: new Map(),
        graph: new Map(),
        userLock: new Map(),
        adaptiveThreshold: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;
  }

  _getBaseScore(e) {
    let s = 0;
    if (e.includes('PAYMENT')) s += 20;
    if (e.includes('TXN_FAIL')) s += 35;
    if (e.includes('RETRY')) s += 15;
    if (e.includes('WHATSAPP')) s += 20;
    if (e.includes('SPAM')) s += 45;
    if (e.includes('ERROR')) s += 30;
    if (e.includes('UNAUTHORIZED')) s += 60;
    return s;
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const e = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    // ---------------------------
    // ADAPTIVE THRESHOLD PER USER
    // ---------------------------
    let threshold = this.state.adaptiveThreshold.get(user) || this.baseThreshold;

    // if user keeps being safe → relax threshold slightly
    if (delta > 30000) {
      threshold *= 0.98;
    }

    // ---------------------------
    // BASE SCORE
    // ---------------------------
    const base = this._getBaseScore(e);

    // ---------------------------
    // SHORT TERM MEMORY
    // ---------------------------
    let short = this.state.shortTerm.get(user) || 0;
    short = delta < 2000 ? short + base * 1.5 : short * 0.8;

    // ---------------------------
    // LONG TERM MEMORY
    // ---------------------------
    let long = this.state.longTerm.get(user) || 0;
    long = long * 0.94 + base;

    // ---------------------------
    // EVENT CHAIN ANALYSIS
    // ---------------------------
    const chain = this.state.graph.get(user) || [];
    chain.push(e);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    const chainStr = trimmed.join('→');

    let patternBoost = 1;
    if (chainStr.includes('PAYMENT→TXN_FAIL')) patternBoost += 0.3;
    if (chainStr.includes('TXN_FAIL→UNAUTHORIZED')) patternBoost += 0.6;
    if (chainStr.includes('PAYMENT→TXN_FAIL→UNAUTHORIZED')) patternBoost += 1.2;

    // ---------------------------
    // FINAL SCORE
    // ---------------------------
    const score = ((short * 0.6) + (long * 0.4)) * patternBoost;

    // persist
    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);
    this.state.adaptiveThreshold.set(user, threshold);

    // ---------------------------
    // LOCK SYSTEM
    // ---------------------------
    const lockUntil = this.state.lockUntil.get(user) || 0;

    if (now < lockUntil) {
      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(score),
        retryAfter: lockUntil - now,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // HARD BLOCK ESCALATION
    if (score >= threshold * 1.6) {
      this.state.lockUntil.set(user, now + 20000);
      this.state.userLock.set(user, true);

      return {
        type: 'HARD_BLOCK',
        score: Math.round(score),
        cooldown: 20000,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // SOFT BLOCK
    if (score >= threshold) {
      this.state.lockUntil.set(user, now + 12000);

      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(score),
        cooldown: 12000,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // REVIEW
    if (score >= threshold * 0.75) {
      return {
        type: 'REVIEW',
        score: Math.round(score),
        user,
        event: packet.event,
        ts: now,
        safe: true
      };
    }

    return {
      type: 'SAFE',
      score: Math.round(score),
      user,
      event: packet.event,
      ts: now,
      safe: true
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V12 DEPLOYED (ADAPTIVE POLICY ENGINE)"
