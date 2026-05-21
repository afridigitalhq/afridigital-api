#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/fraud/fraud.engine.cjs"

cat > "$FILE" << 'JS'
class FraudEngine {
  constructor() {
    this.threshold = 70;

    if (!global.__FRAUD_STATE__) {
      global.__FRAUD_STATE__ = {
        userRisk: new Map(),
        lockUntil: new Map(),
        graph: new Map(),
        lastTime: new Map(),
        userLock: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const e = (packet.event || '').toUpperCase();
    const now = Date.now();

    const halfLife = 20000;

    let prev = this.state.userRisk.get(user) || 0;

    // time decay (stabilizes long-term risk)
    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;
    const decay = Math.exp(-delta / halfLife);
    prev *= decay;

    // base scoring
    let score = 0;
    if (e.includes('PAYMENT')) score += 20;
    if (e.includes('TXN_FAIL')) score += 35;
    if (e.includes('RETRY')) score += 15;
    if (e.includes('WHATSAPP')) score += 20;
    if (e.includes('SPAM')) score += 45;
    if (e.includes('ERROR')) score += 30;
    if (e.includes('UNAUTHORIZED')) score += 60;

    // event chain tracking
    const chain = this.state.graph.get(user) || [];
    chain.push(e);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    // pattern amplification
    if (trimmed.join('→').includes('PAYMENT→TXN_FAIL→UNAUTHORIZED')) {
      score *= 2.3;
    }

    // velocity detection
    if (delta < 2000) score *= 1.6;
    if (delta < 800) score *= 2.0;

    const total = prev + score;

    // normalize explosion risk
    const normalized = Math.tanh(total / this.threshold) * this.threshold;

    this.state.userRisk.set(user, normalized);
    this.state.lastTime.set(user, now);

    // cooldown system
    const lockUntil = this.state.lockUntil.get(user) || 0;

    // auto unlock if expired
    if (now > lockUntil && this.state.userLock.has(user)) {
      this.state.userLock.delete(user);
    }

    // active lock
    if (now < lockUntil) {
      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(normalized),
        retryAfter: lockUntil - now,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // trigger soft block
    if (normalized >= this.threshold) {
      this.state.lockUntil.set(user, now + 12000);
      this.state.userLock.set(user, true);

      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(normalized),
        cooldown: 12000,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // review stage
    if (normalized >= this.threshold * 0.7) {
      return {
        type: 'REVIEW',
        score: Math.round(normalized),
        user,
        event: packet.event,
        ts: now,
        safe: true
      };
    }

    return {
      type: 'SAFE',
      score: Math.round(normalized),
      user,
      event: packet.event,
      ts: now,
      safe: true
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V10 DEPLOYED"
