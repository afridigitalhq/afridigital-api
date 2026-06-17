const ledger = [];

function calculateCost(tokens = 0, provider = "mock") {
  const base = provider === "openai" ? 5 : provider === "ollama" ? 2 : 1;
  return Math.ceil(tokens / 100) * base;
}

function recordUsage({ apiKey, tenant, tokens, provider, latency }) {
  const cost = calculateCost(tokens, provider);

  ledger.push({
    apiKey,
    tenant,
    tokens,
    provider,
    latency,
    cost,
    ts: Date.now()
  });

  return cost;
}

function getLedger() {
  return ledger;
}

module.exports = { recordUsage, getLedger };
