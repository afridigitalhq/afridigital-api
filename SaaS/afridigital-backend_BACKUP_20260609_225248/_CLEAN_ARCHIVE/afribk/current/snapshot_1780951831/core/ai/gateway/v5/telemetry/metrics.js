const metrics = {
  providers: {
    mock: { success: 0, fail: 0, latency: [] },
    ollama: { success: 0, fail: 0, latency: [] },
    openai: { success: 0, fail: 0, latency: [] }
  }
};

function record(provider, type, latency = 0) {
  const p = metrics.providers[provider] || (metrics.providers[provider] = {
    success: 0, fail: 0, latency: []
  });

  if (type === "success") p.success++;
  if (type === "fail") p.fail++;
  if (latency) p.latency.push(latency);

  if (p.latency.length > 50) p.latency.shift();
}

function snapshot() {
  return metrics;
}

module.exports = { record, snapshot };
