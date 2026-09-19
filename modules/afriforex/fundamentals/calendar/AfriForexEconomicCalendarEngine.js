import Biquote from "biquote";

const bq = new Biquote();

const SYMBOL_CURRENCIES = {
  "EUR/USD": ["EUR", "USD"],
  "GBP/USD": ["GBP", "USD"],
  "USD/JPY": ["USD", "JPY"],
  "USD/CHF": ["USD", "CHF"],
  "AUD/USD": ["AUD", "USD"],
  "NZD/USD": ["NZD", "USD"],
  "USD/CAD": ["USD", "CAD"],
  "USD/NGN": ["USD", "NGN"],
  "XAU/USD": ["USD"],
  "BTC/USD": ["USD"],
  "BTC/USDT": ["USD"],
  "ETH/USD": ["USD"],
  "ETH/USDT": ["USD"]
};

function normalizeSymbol(symbol) {
  const value = String(symbol || "")
    .trim()
    .toUpperCase();

  return value.includes(":")
    ? value.split(":").pop()
    : value;
}

function resolveCurrencies(symbol) {
  const normalized = normalizeSymbol(symbol);

  if (SYMBOL_CURRENCIES[normalized]) {
    return SYMBOL_CURRENCIES[normalized];
  }

  const compact = normalized.replace("/", "").replace("USDT", "USD");

  if (compact.length === 6) {
    return [compact.slice(0, 3), compact.slice(3, 6)];
  }

  if (compact.endsWith("USD")) {
    return ["USD"];
  }

  return [];
}

function normalizeImportance(value) {
  const importance = String(value || "").trim().toLowerCase();

  if (importance === "high") return "HIGH";
  if (importance === "medium") return "MEDIUM";
  if (importance === "low") return "LOW";

  return "UNKNOWN";
}

function normalizeEvent(event = {}) {
  return {
    id: event.id || null,
    eventId: event.eventId || null,
    time: event.time || null,
    period: event.period || null,
    countryCode: event.countryCode || null,
    currency: event.currency || null,
    name: event.name || null,
    importance: normalizeImportance(event.importance),
    type: event.type || null,
    sector: event.sector || null,
    unit: event.unit || null,
    multiplier: event.multiplier || null,
    digits: Number.isFinite(event.digits) ? event.digits : null,
    actual: event.actual ?? null,
    forecast: event.forecast ?? null,
    previous: event.previous ?? null,
    revisedPrevious: event.revisedPrevious ?? null,
    revision: Number.isFinite(event.revision) ? event.revision : 0,
    timeMode: event.timeMode || null,
    sourceUrl: event.sourceUrl || null,
    source: event.source || "biquote"
  };
}

function eventRelevance(event, currencies) {
  if (!currencies.length) return true;

  return currencies.includes(
    String(event.currency || "").trim().toUpperCase()
  );
}

function minutesUntil(eventTime, now) {
  const eventMs = Date.parse(eventTime);
  const nowMs = Date.parse(now);

  if (!Number.isFinite(eventMs) || !Number.isFinite(nowMs)) {
    return null;
  }

  return Math.round((eventMs - nowMs) / 60000);
}

const AfriForexEconomicCalendarEngine = {
  async analyze(input = {}) {
    const symbol = input.symbol || null;
    const assetType = String(input.assetType || "")
      .trim()
      .toLowerCase();

    const domain =
      assetType === "crypto"
        ? "CRYPTO"
        : "FOREX";

    const currencies = resolveCurrencies(symbol);
    const now = input.now || new Date().toISOString();
    const lookaheadMinutes = Number.isFinite(input.lookaheadMinutes)
      ? input.lookaheadMinutes
      : 120;

    try {
      const providerEvents = await bq.calendar({
        importance: input.importance || undefined,
        countries: input.countries || undefined
      });

      const events = (Array.isArray(providerEvents) ? providerEvents : [])
        .map(normalizeEvent)
        .filter((event) => eventRelevance(event, currencies))
        .map((event) => ({
          ...event,
          minutesUntil: minutesUntil(event.time, now)
        }))
        .sort((a, b) => {
          const aTime = Date.parse(a.time);
          const bTime = Date.parse(b.time);

          if (!Number.isFinite(aTime)) return 1;
          if (!Number.isFinite(bTime)) return -1;

          return aTime - bTime;
        });

      const imminentEvents = events.filter(
        (event) =>
          event.minutesUntil !== null &&
          event.minutesUntil >= 0 &&
          event.minutesUntil <= lookaheadMinutes &&
          event.importance === "HIGH"
      );

      const highImpactEvents = events.filter(
        (event) => event.importance === "HIGH"
      );

      const riskLevel =
        imminentEvents.length > 0
          ? "HIGH"
          : highImpactEvents.length > 0
            ? "ELEVATED"
            : events.length > 0
              ? "NORMAL"
              : "LOW";

      return {
        status: "AVAILABLE",
        provider: "biquote",
        domain,
        assetType: assetType || "forex",
        symbol,
        currencies,
        events,
        impact:
          highImpactEvents.length > 0
            ? "HIGH"
            : events.length > 0
              ? "MEDIUM"
              : "NONE",
        riskLevel,
        imminent: imminentEvents.length > 0,
        imminentEvents,
        eventCount: events.length,
        highImpactEventCount: highImpactEvents.length,
        lookaheadMinutes,
        observedAt: now,
        reason:
          imminentEvents.length > 0
            ? "HIGH_IMPACT_EVENT_IMMINENT"
            : events.length > 0
              ? "ECONOMIC_CALENDAR_AVAILABLE"
              : "NO_RELEVANT_EVENTS"
      };
    } catch (error) {
      return {
        status: "ERROR",
        provider: "biquote",
        domain,
        assetType: assetType || "forex",
        symbol,
        currencies,
        events: [],
        impact: "UNKNOWN",
        riskLevel: "UNKNOWN",
        imminent: false,
        imminentEvents: [],
        eventCount: 0,
        highImpactEventCount: 0,
        lookaheadMinutes,
        observedAt: now,
        reason: "ECONOMIC_CALENDAR_PROVIDER_ERROR",
        error: error?.message || "Economic calendar provider failed"
      };
    }
  }
};

export default Object.freeze(AfriForexEconomicCalendarEngine);
