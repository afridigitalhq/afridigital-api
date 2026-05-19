
const suspiciousMap = new Map();

// simple risk scoring memory (in-memory baseline)
function analyze(tx) {
  const key = tx.userId;

  const now = Date.now();

  if (!suspiciousMap.has(key)) {
    suspiciousMap.set(key, []);
  }

  const history = suspiciousMap.get(key);

  history.push({ time: now, amount: tx.amount });

  // keep only last 10 events
  if (history.length > 10) history.shift();

  let risk = 0;

  // ⚡ velocity check (too many tx in short time)
  if (history.length >= 5) {
    const timeDiff = now - history[0].time;
    if (timeDiff < 10000) risk += 70; // 5 tx in 10 sec = HIGH RISK
  }

  // 💰 large spike detection
  const avg = history.reduce((s, t) => s + t.amount, 0) / history.length;
  if (tx.amount > avg * 3) risk += 30;

  return {
    riskScore: risk,
    flagged: risk >= 70
  };
}

module.exports = { analyze };

