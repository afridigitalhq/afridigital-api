#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/fraud/fraud.engine.cjs"

cat > "$FILE" << 'JS'
class FraudEngine {
  constructor() {
    this.threshold = 70;

    if (!global.__FRAUD_STATE__) {
      global.__FRAUD_STATE__ = {
        longTerm: new Map(),
        shortTerm: new Map(),
        lockUntil: new Map(),
        lastTime: new Map(),
        graph: new Map(),
        userLock: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const e = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    // ---------------------------
    // BASE SIGNALS
    // ---------------------------
    let base = 0;
    if (e.includes('PAYMENT')) base += 20;
    if (e.includes('TXN_FAIL')) base += 35;
    if (e.includes('RETRY')) base += 15;
    if (e.includes('WHATSAPP')) base += 20;
    if (e.includes('SPAM')) base += 45;
    if (e.includes('ERROR')) base += 30;
    if (e.includes('UNAUTHORIZED')) base += 60;

    // ---------------------------
    // SHORT TERM (burst attack)
    // ---------------------------
    let short = this.state.shortTerm.get(user) || 0;

    if (delta < 2000) short += base * 1.4;
    else short *= 0.7; // decay fast

    // ---------------------------
    // LONG TERM (behavior reputation)
    // ---------------------------
    let long = this.state.longTerm.get(user) || 0;
    long = long * 0.95 + base * 0.8;

    // ---------------------------
    // EVENT CHAIN MEMORY
    // ---------------------------
    const chain = this.state.graph.get(user) || [];
    chain.push(e);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    // pattern boost
    if (trimmed.join('→').includes('PAYMENT→TXN_FAIL→UNAUTHORIZED')) {
      short *= 1.8;
      long *= 1.2;
    }

    // ---------------------------
    // FINAL SCORE (DUAL LAYER)
    // ---------------------------
    const score = (short * 0.6) + (long * 0.4);

    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);

    // ---------------------------
    // COOLDOWN SYSTEM
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

    // ---------------------------
    // SOFT BLOCK
    // ---------------------------
    if (score >= this.threshold) {
      this.state.lockUntil.set(user, now + 12000);
      this.state.userLock.set(user, true);

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

    // ---------------------------
    // REVIEW ZONE (more strict)
    // ---------------------------
    if (score >= this.threshold * 0.8 && short > this.threshold * 0.6) {
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

echo "🧠 FRAUD ENGINE V11 DEPLOYED (DUAL LAYER BRAIN)"
