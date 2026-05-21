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

    this.services = {
      wallet: null,
      queue: null,
      whatsapp: null,
      renderSync: null
    };
  }

  registerServices(s = {}) {
    this.services = { ...this.services, ...s };
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

  _risk(score, threshold) {
    if (score >= threshold * 1.6) return "CRITICAL";
    if (score >= threshold) return "HIGH";
    if (score >= threshold * 0.75) return "MEDIUM";
    return "LOW";
  }

  _executeAction(action, packet, meta) {
    // 🔧 FIXED: always send meta (safe structured payload)

    if (action === "BLOCK" && this.services.wallet) {
      this.services.wallet(meta);
    }

    if (action === "THROTTLE" && this.services.queue) {
      this.services.queue(meta);
    }

    if (action === "REVIEW" && this.services.whatsapp) {
      this.services.whatsapp(meta);
    }

    if (this.services.renderSync) {
      this.services.renderSync(meta);
    }
  }

  analyze(packet) {
    const user = packet?.payload?.user || packet?.user || 'anonymous';
    const event = (packet.event || '').toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let threshold = this.state.adaptiveThreshold.get(user) || this.baseThreshold;

    if (delta > 30000) threshold *= 0.98;

    const base = this._base(event);

    let short = this.state.shortTerm.get(user) || 0;
    let long = this.state.longTerm.get(user) || 0;

    short = delta < 2000 ? short + base * 1.4 : short * 0.75;
    long = long * 0.95 + base;

    const chain = this.state.graph.get(user) || [];
    chain.push(event);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    let boost = 1;

    const chainStr = trimmed.join('→');
    if (chainStr.includes('PAYMENT→TXN_FAIL')) boost += 0.3;
    if (chainStr.includes('TXN_FAIL→UNAUTHORIZED')) boost += 0.8;
    if (chainStr.includes('PAYMENT→TXN_FAIL→UNAUTHORIZED')) boost += 1.5;

    const score = ((short * 0.6) + (long * 0.4)) * boost;

    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);
    this.state.adaptiveThreshold.set(user, threshold);

    const lockUntil = this.state.lockUntil.get(user) || 0;

    let action = "ALLOW";

    if (now < lockUntil) {
      action = "THROTTLE";
    } else if (score >= threshold * 1.6) {
      action = "BLOCK";
      this.state.lockUntil.set(user, now + 20000);
    } else if (score >= threshold) {
      action = "THROTTLE";
      this.state.lockUntil.set(user, now + 12000);
    } else if (score >= threshold * 0.75) {
      action = "REVIEW";
    }

    const meta = {
      user,
      event,
      action,
      risk: this._risk(score, threshold),
      score: Math.round(score),
      threshold: Math.round(threshold),
      chain: trimmed,
      ts: now
    };

    this._executeAction(action, packet, meta);

    return {
      ...meta,
      safe: action === "ALLOW"
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 V16 FIXED: ACTION HOOK CLEANED (META-ONLY DISPATCH)"
