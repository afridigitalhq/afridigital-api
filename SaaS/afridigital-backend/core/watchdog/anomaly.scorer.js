/**
 * 📊 ANOMALY SCORER (A3.10)
 * Detects irregular event behavior patterns
 */

function scoreAnomaly(signals) {
  if (!signals.length) return 0;

  const types = {};
  let sizeVariance = 0;

  signals.forEach(s => {
    types[s.type] = (types[s.type] || 0) + 1;
    sizeVariance += s.payloadSize;
  });

  const diversity = Object.keys(types).length;
  const burstiness = Math.max(...Object.values(types));

  // simple heuristic model (upgradeable to ML later)
  const score =
    (burstiness / 50) +
    (diversity < 2 ? 0.6 : 0.2) +
    (sizeVariance / (signals.length * 1000));

  return Math.min(score, 1);
}

module.exports = { scoreAnomaly };
