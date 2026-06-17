const state = require('../../registry/providerState');

function scoreProvider(name) {
  const p = state.get(name);
  if (!p) return -999;

  const successRate = p.success / (p.success + p.fail || 1);
  const avgLatency =
    p.latency.reduce((a,b)=>a+b,0) / (p.latency.length || 1);

  let score =
    successRate * 100
    - (avgLatency / 50)
    - (p.fail * 5);

  if (p.circuit === "OPEN") score -= 1000;

  return score;
}

function rankProviders(list) {
  return list
    .map(name => ({ name, score: scoreProvider(name) }))
    .sort((a,b)=>b.score - a.score);
}

module.exports = { scoreProvider, rankProviders };
