const registry = {
  ollama: { ok: 1, fail: 0, latency: [] },
  mock: { ok: 1, fail: 0, latency: [] },
  openai: { ok: 1, fail: 0, latency: [] }
};

function recordSuccess(provider, latency) {
  registry[provider].ok++;
  registry[provider].latency.push(latency);
}

function recordFail(provider) {
  registry[provider].fail++;
}

function score(provider) {
  const r = registry[provider];
  const successRate = r.ok / (r.ok + r.fail + 1);
  const avgLatency =
    r.latency.reduce((a,b)=>a+b,0) / (r.latency.length || 1);

  return successRate * 100 - avgLatency * 0.1;
}

function getBest() {
  return Object.keys(registry)
    .sort((a,b)=>score(b)-score(a))[0];
}

module.exports = {
  registry,
  recordSuccess,
  recordFail,
  score,
  getBest
};
