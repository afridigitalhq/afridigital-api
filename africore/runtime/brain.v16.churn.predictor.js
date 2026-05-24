/**
 * Lightweight churn heuristic model
 */
function predictChurn(userMemory = []) {

  let inactivityPenalty = 0;

  if (!userMemory.length) return 0.9;

  const last = userMemory[userMemory.length - 1];
  const age = Date.now() - (last?.ts || Date.now());

  if (age > 86400000) inactivityPenalty += 0.4; // 24h
  if (age > 604800000) inactivityPenalty += 0.4; // 7d

  let sentiment = 0;

  for (const m of userMemory) {
    if (m.message.includes("stop")) sentiment += 0.5;
    if (m.message.includes("bad")) sentiment += 0.3;
  }

  return Math.min(1, inactivityPenalty + sentiment);
}

module.exports = { predictChurn };
