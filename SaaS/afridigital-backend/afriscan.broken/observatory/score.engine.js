const weights = require('./weights');

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function computeScore(truth = {}) {
  const infra = truth.infra?.availability ? 100 : 40;
  const db = truth.databases?.mongo === 'ONLINE' ? 100 : 30;
  const security = truth.meta?.integrity ? 70 : 40;
  const telemetry = truth.telemetry?.cpu !== undefined ? 60 : 20;

  const score =
    infra * weights.infra +
    db * weights.databases +
    security * weights.security +
    telemetry * weights.telemetry;

  return {
    score: clamp(Math.round(score)),
    breakdown: { infra, db, security, telemetry }
  };
}

module.exports = { computeScore };
