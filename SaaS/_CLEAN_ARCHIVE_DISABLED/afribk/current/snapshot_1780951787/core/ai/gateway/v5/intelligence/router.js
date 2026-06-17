const metrics = require('../telemetry/metrics');
const breaker = require('../circuit/breaker');

const base = ["mock", "ollama", "openai"];

function avg(arr) {
  return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 100;
}

function score(provider) {
  const m = metrics.snapshot().providers[provider] || { success: 0, fail: 0, latency: [] };

  const successRate = (m.success + 1) / (m.fail + 1);
  const latency = avg(m.latency);

  return successRate * 100 - latency;
}

function pickProvider() {
  const available = base.filter(p => !breaker.isOpen(p));

  const ranked = available.sort((a,b) => score(b) - score(a));

  return ranked[0] || "mock";
}

module.exports = { pickProvider, score };
