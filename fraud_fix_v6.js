const fs = require('fs');

const p = './afridigital-core/kernel/fraud/fraud.engine.cjs';

let code = fs.readFileSync(p, 'utf8');

const patched = `
class FraudEngine {
  constructor() {
    this.threshold = 70;

    if (!global.__FRAUD_STATE__) {
      global.__FRAUD_STATE__ = {
        userRisk: new Map(),
        userLock: new Map(),
        lastTime: new Map(),
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

    if (this.state.userLock.get(user)) {
      return {
        type: 'FRAUD_BLOCKED',
        score: 100,
        locked: true,
        user,
        event: packet.event,
        ts: now,
        safe: false
      };
    }

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    if (delta < 3000) score *= 1.6;
    if (delta < 1000) score *= 2.2;

    const chain = this.state.graph.get(user) || [];
    chain.push(e);

    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    const prev = this.state.userRisk.get(user) || 0;
    const accumulated = prev + score;

    this.state.userRisk.set(user, accumulated);
    this.state.lastTime.set(user, now);

    if (accumulated >= this.threshold) {
      this.state.userLock.set(user, true);
    }

    return {
      type: accumulated >= this.threshold ? 'FRAUD_BLOCKED' : 'SAFE',
      score: Math.round(accumulated),
      chain: trimmed,
      user,
      ts: now,
      safe: accumulated < this.threshold,
      locked: this.state.userLock.has(user)
    };
  }
}

module.exports = new FraudEngine();
`;

fs.writeFileSync(p, patched);
console.log('🧠 FRAUD ENGINE V6 APPLIED (LOCAL SAFE MODE)');
