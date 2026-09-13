const AfriForexEconomicCalendarEngine = {
  analyze(input = {}) {
    return {
      status: "NOT_CONNECTED",
      symbol: input.symbol || null,
      events: [],
      impact: "UNKNOWN",
      riskLevel: "UNKNOWN",
      imminent: false,
      reason: "ECONOMIC_CALENDAR_PROVIDER_NOT_CONNECTED"
    };
  }
};

export default Object.freeze(AfriForexEconomicCalendarEngine);
