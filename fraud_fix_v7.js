const fs = require('fs');

const p = './afridigital-core/kernel/fraud/fraud.engine.cjs';
let c = fs.readFileSync(p, 'utf8');

const v7 = `
class FraudEngine {
  constructor() {
    this.threshold = 70;

    if (!global.__FRAUD_STATE__) {
      global.__FRAUD_STATE__ = {
        userRisk: new Map(),
        lastTime: new Map(),
        lockUntil: new Map(),
        graph: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const e = (packet.event || '').toUpperCase();
    const now = Date.now();

    let score = 0;

    if (e.includes('PAYMENT')) score += 20;
    if (e.includes('TXN_FAIL')) score += 35;
    if (e.includes('RETRY')) score += 15;
    if (e.includes('WHATSAPP')) score += 20;
    if (e.includes('SPAM')) score += 45;
    if (e.includes('ERROR')) score += 30;
    if (e.includes('UNAUTHORIZED')) score += 60;

    // ---------------------------
    // GRACE RECOVERY (DECAY SYSTEM)
    // ---------------------------
    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let prevScore = this.state.userRisk.get(user) || 0;

    // decay over time
    if (delta > 10000) prevScore *= 0.5;
    else if (delta > 5000) prevScore *= 0.75;

    // burst amplification
    if (delta < 2000) score *= 1.5;

    const total = prevScore + score;

    this.state.userRisk.set(user, total);
    this.state.lastTime.set(user, now);

    // ---------------------------
    // SOFT BLOCK LOGIC (NOT PERMANENT)
    // ---------------------------
    const lockUntil = this.state.lockUntil.get(user) || 0;

    if (now < lockUntil) {
      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(total),
        retryAfter: lockUntil - now,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // trigger soft block instead of permanent lock
    if (total >= this.threshold) {
      this.state.lockUntil.set(user, now + 15000); // 15s cooldown

      return {
        type: 'SOFT_BLOCKED',
        score: Math.round(total),
        cooldown: 15000,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    // REVIEW zone
    if (total >= this.threshold * 0.7) {
      return {
        type: 'REVIEW',
        score: Math.round(total),
        user,
        event: packet.event,
        ts: now,
        safe: true
      };
    }

    return {
      type: 'SAFE',
      score: Math.round(total),
      user,
      event: packet.event,
      ts: now,
      safe: true
    };
  }
}

module.exports = new FraudEngine();
`;

c = v7;
fs.writeFileSync(p, c);

console.log("🧠 FRAUD ENGINE v7 (SOFT BLOCK + GRACE RECOVERY) INSTALLED");
