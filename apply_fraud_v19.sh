#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/fraud/fraud.engine.cjs"

cat > "$FILE" << 'JS'
const { createClient } = require("redis");

let redis;

async function getRedis() {
  if (redis) return redis;
  redis = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  await redis.connect().catch(() => {});
  return redis;
}

class FraudEngine {
  constructor() {
    this.threshold = 70;

    this.state = {
      shortTerm: new Map(),
      longTerm: new Map(),
      graph: new Map(),
      lastTime: new Map()
    };
  }

  _score(event) {
    let s = 0;
    if (event.includes("PAYMENT")) s += 20;
    if (event.includes("TXN_FAIL")) s += 35;
    if (event.includes("RETRY")) s += 15;
    if (event.includes("WHATSAPP")) s += 20;
    if (event.includes("SPAM")) s += 45;
    if (event.includes("UNAUTHORIZED")) s += 60;
    return s;
  }

  async _emit(type, data) {
    const r = await getRedis().catch(() => null);
    if (!r) return;

    await r.xAdd("fraud:stream", "*", {
      type,
      data: JSON.stringify(data)
    }).catch(() => {});
  }

  async analyze(packet) {
    const user = packet?.payload?.user || packet?.user || "anonymous";
    const event = (packet.event || "").toUpperCase();
    const now = Date.now();

    const last = this.state.lastTime.get(user) || now;
    const delta = now - last;

    let base = this._score(event);

    let short = this.state.shortTerm.get(user) || 0;
    let long = this.state.longTerm.get(user) || 0;

    short = delta < 2000 ? short + base * 1.4 : short * 0.8;
    long = long * 0.95 + base;

    const chain = this.state.graph.get(user) || [];
    chain.push(event);
    const trimmed = chain.slice(-5);
    this.state.graph.set(user, trimmed);

    const score = (short * 0.6) + (long * 0.4);

    this.state.shortTerm.set(user, short);
    this.state.longTerm.set(user, long);
    this.state.lastTime.set(user, now);

    let action = "ALLOW";

    if (score >= this.threshold * 1.6) action = "BLOCK";
    else if (score >= this.threshold) action = "THROTTLE";
    else if (score >= this.threshold * 0.75) action = "REVIEW";

    const result = {
      user,
      event,
      action,
      score: Math.round(score),
      chain: trimmed,
      ts: now
    };

    // 🌐 V19 MESH EMISSION
    await this._emit("NODE_DECISION", result);

    return {
      ...result,
      safe: action === "ALLOW"
    };
  }
}

module.exports = new FraudEngine();
JS

echo "🧠 FRAUD ENGINE V19 DEPLOYED (MESH NETWORK CORE)"
