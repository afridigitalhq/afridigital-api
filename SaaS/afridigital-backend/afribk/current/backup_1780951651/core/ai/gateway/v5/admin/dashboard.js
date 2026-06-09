const analytics = require("../analytics");
const billing = require("../billing/engine");

function getSystemOverview() {
  const all = analytics.getAll();

  return {
    totalRequests: all.length,
    avgLatency:
      all.reduce((a, b) => a + (b.latency || 0), 0) / (all.length || 1),

    providerUsage: all.reduce((acc, r) => {
      acc[r.provider] = (acc[r.provider] || 0) + 1;
      return acc;
    }, {}),

    revenue: billing.getLedger().reduce((sum, x) => sum + (x.cost || 0), 0)
  };
}

function getTenantStats(apiKey) {
  return analytics.getStats(apiKey);
}

module.exports = { getSystemOverview, getTenantStats };
