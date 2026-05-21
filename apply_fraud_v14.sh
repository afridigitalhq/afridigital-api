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
        adaptiveThreshold: new Map()
      };
    }

    this.state = global.__FRAUD_STATE__;

    // 🧠 POLICY ENGINE (V14 CORE)
    this.policy = {
      BLOCK: (s, t) => s >= t * 1.6,
      THROTTLE: (s, t) => s >= t,
      CHALLENGE: (s, t) => s >= t * 0.75
    };

    this.hooks = {
      wallet: null,
      queue: null,
      whatsapp: null,
      renderSync: null
    };
  }

  registerHooks(hooks = {}) {
    this.hooks = { ...this.hooks, ...hooks };
  }

  _score(event) {
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

  _decide(score, threshold, lockUntil, now) {
    if (now < lockUntil) return 'THROTTLE';
    if (this.policy.BLOCK(score, threshold)) return 'BLOCK';
    if (this.policy.THROTTLE(score, threshold)) return 'THROTTLE';
    if (this.policy.CHALLENGE(score, threshold)) return 'CHALLENGE';
    return 'ALLOW';
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const event = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let threshold = this.state.adaptiveThreshold.get(user) || this.baseThreshold;

    if (delta > 30000) threshold *= 0.98;

    // memory layers
    let short = this.state.shortTerm.get(user) || 0;
    let long = this.state.longTerm.get(user) || 0;

    const base = this._score(event);

    short = delta < 2000 ? short + base * 1.4 : short * 0.75;
    long = long * 0.95 + base;

    // chain analysis
    const chain = this.state.graph.get(user) || [];
    chain.push(event);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    let boost = 1;
    const chainStr = trimmed.join('→');

    if (chainStr.includes('PAYMENT→TXN_FAIL')) boost += 0.3;
    if (chainStr.includes('TXN_FAIL→UNAUTHORIZED')) boost += 0.7;

    const score = ((short * 0.6) + (long * 0.4)) * boost;

    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);
    this.state.adaptiveThreshold.set(user, threshold);

    const lockUntil = this.state.lockUntil.get(user) || 0;

    const action = this._decide(score, threshold, lockUntil, now);

    // hooks
    if (action === 'BLOCK' && this.hooks.wallet) this.hooks.wallet(packet);
    if (action === 'THROTTLE' && this.hooks.queue) this.hooks.queue(packet);
    if (action === 'CHALLENGE' && this.hooks.whatsapp) this.hooks.whatsapp(packet);

    if (this.hooks.renderSync) {
      this.hooks.renderSync({
        user,
        action,
        score: Math.round(score),
        threshold: Math.round(threshold)
      });
    }

    // 🧠 EXPLANATION ENGINE (V14 FEATURE)
    const explanation = {
      base_score: base,
      boost,
      short,
      long,
      chain: trimmed,
      threshold
    };

    return {
      action,
      score: Math.round(score),
      threshold: Math.round(threshold),
      user,
      event,
      ts: now,
      safe: action === 'ALLOW',
      explanation
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V14 DEPLOYED (POLICY + EXPLANATION CORE)"
