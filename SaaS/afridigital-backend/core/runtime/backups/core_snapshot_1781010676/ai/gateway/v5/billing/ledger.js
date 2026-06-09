const ledger = [];

function record({ apiKey, tenant, tokens, provider }) {
  const cost = Math.max(1, Math.ceil(tokens / 100));

  ledger.push({
    apiKey,
    tenant,
    provider,
    tokens,
    cost,
    ts: Date.now()
  });

  return cost;
}

function getLedger() {
  return ledger;
}

module.exports = { record, getLedger };
