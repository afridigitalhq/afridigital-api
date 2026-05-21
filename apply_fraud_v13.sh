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

    // 🧩 SERVICE HOOKS (V13 CORE)
    this.hooks = {
      wallet: null,
      whatsapp: null,
      queue: null,
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

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const event = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let threshold = this.state.adaptiveThreshold.get(user) || this.baseThreshold;

    // decay threshold slowly
    if (delta > 30000) threshold *= 0.98;

    const base = this._score(event);

    // short/long memory
    let short = this.state.shortTerm.get(user) || 0;
    let long = this.state.longTerm.get(user) || 0;

    short = delta < 2000 ? short + base * 1.4 : short * 0.75;
    long = long * 0.95 + base;

    // chain memory
    const chain = this.state.graph.get(user) || [];
    chain.push(event);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    let boost = 1;

    if (trimmed.join('→').includes('PAYMENT→TXN_FAIL')) boost += 0.3;
    if (trimmed.join('→').includes('TXN_FAIL→UNAUTHORIZED')) boost += 0.7;

    const score = ((short * 0.6) + (long * 0.4)) * boost;

    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);
    this.state.adaptiveThreshold.set(user, threshold);

    const lockUntil = this.state.lockUntil.get(user) || 0;

    // -----------------------------
    // STATE ACTION ENGINE (V13 CORE)
    // -----------------------------
    let action = 'ALLOW';

    if (score >= threshold * 1.6) action = 'BLOCK';
    else if (score >= threshold) action = 'THROTTLE';
    else if (score >= threshold * 0.75) action = 'CHALLENGE';

    // soft lock handling
    if (now < lockUntil) {
      action = 'THROTTLE';
    }

    // trigger hooks (IMPORTANT V13 FEATURE)
    if (action === 'BLOCK' && this.hooks.wallet) {
      this.hooks.wallet(packet);
    }

    if (action === 'THROTTLE' && this.hooks.queue) {
      this.hooks.queue(packet);
    }

    if (action === 'CHALLENGE' && this.hooks.whatsapp) {
      this.hooks.whatsapp(packet);
    }

    if (this.hooks.renderSync) {
      this.hooks.renderSync({
        user,
        action,
        score: Math.round(score)
      });
    }

    return {
      action,
      score: Math.round(score),
      threshold: Math.round(threshold),
      user,
      event: packet.event,
      ts: now,
      safe: action === 'ALLOW',
      chain: trimmed
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V13 DEPLOYED (SERVICE ORCHESTRATION LAYER)"
