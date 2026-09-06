const AfriMarketEvidence = {
  create(input = {}) {
    return {
      source: input.source || "UNKNOWN",
      type: input.type || "UNKNOWN",
      symbol: input.symbol || null,
      data: input.data || {},
      observedAt: input.observedAt || new Date().toISOString(),
      freshness: input.freshness || "UNKNOWN",
      status: input.status || "UNKNOWN",
      providerRequest: input.providerRequest || null
    };
  }
};

export default AfriMarketEvidence;
