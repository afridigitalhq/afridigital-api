#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/fraud/fraud.engine.cjs"
STATE="./afridigital-core/kernel/fraud/.fraud_state.json"

mkdir -p ./afridigital-core/kernel/fraud

# init state file if missing
[ ! -f "$STATE" ] && echo '{"userRisk":{},"lockUntil":{},"lastTime":{},"graph":{}}' > "$STATE"

cat > "$FILE" << 'JS'
const fs = require('fs');

const STATE_PATH = './afridigital-core/kernel/fraud/.fraud_state.json';

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch (e) {
    return { userRisk:{}, lockUntil:{}, lastTime:{}, graph:{} };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

class FraudEngine {
  constructor() {
    this.threshold = 70;
  }

  analyze(packet) {
    const state = loadState();

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

    // load previous
    let prev = state.userRisk[user] || 0;
    const last = state.lastTime[user] || now;
    const delta = now - last;

    // decay over time
    if (delta > 10000) prev *= 0.5;
    else if (delta > 5000) prev *= 0.75;

    // burst amplification
    if (delta < 2000) score *= 1.5;

    const total = prev + score;

    // REVIEW zone
    if (total >= this.threshold * 0.7) {
      state.userRisk[user] = total;
      state.lastTime[user] = now;
      saveState(state);

      return {
        type: 'REVIEW',
        score: Math.round(total),
        user,
        event: packet.event,
        ts: now,
        safe: true
      };
    }

    // SOFT BLOCK
    if (total >= this.threshold) {
      state.lockUntil[user] = now + 15000;
      state.userRisk[user] = total;
      state.lastTime[user] = now;
      saveState(state);

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

    // SAFE
    state.userRisk[user] = total;
    state.lastTime[user] = now;

    saveState(state);

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
JS

echo "🧠 V9 FRAUD ENGINE (PERSISTENT MEMORY) DEPLOYED"
