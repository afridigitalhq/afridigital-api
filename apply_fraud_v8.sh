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

    const halfLife = 15000;

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let prev = this.state.userRisk.get(user) || 0;

    const decay = Math.exp(-delta / halfLife);
    prev *= decay;

    let score = 0;

    if (e.includes('PAYMENT')) score += 20;
    if (e.includes('TXN_FAIL')) score += 35;
    if (e.includes('RETRY')) score += 15;
    if (e.includes('WHATSAPP')) score += 20;
    if (e.includes('SPAM')) score += 45;
    if (e.includes('ERROR')) score += 30;
    if (e.includes('UNAUTHORIZED')) score += 60;

    const chain = this.state.graph.get(user) || [];
    chain.push(e);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    if (trimmed.includes('PAYMENT') && trimmed.includes('TXN_FAIL')) {
      score += 25;
    }

    const volatility = trimmed.length > 3 ? 1.2 : 1;

    const total = prev + (score * volatility);

    const normalized = Math.tanh(total / this.threshold) * this.threshold;

    this.state.userRisk.set(user, normalized);
    this.state.lastTime.set(user, now);

    const lockUntil = this.state.lockUntil.get(user) || 0;

    if (now > lockUntil) {
      this.state.userLock.delete(user);
    }

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

    if (normalized >= this.threshold) {
      this.state.lockUntil.set(user, now + 12000);

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

echo "🧠 V8 FRAUD ENGINE CLEAN DEPLOYED"
