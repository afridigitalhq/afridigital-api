const VALID_HORIZONS = Object.freeze([
  "SCALP",
  "INTRADAY",
  "SWING",
  "POSITION"
]);

const VALID_DIRECTIONS = Object.freeze([
  "STRONG_BUY",
  "BUY",
  "NEUTRAL",
  "SELL",
  "STRONG_SELL"
]);

function normalize(value) {
  return String(value || "").toUpperCase();
}

function isTradeable(direction, tradeDecision) {
  return (
    VALID_DIRECTIONS.includes(direction) &&
    direction !== "NEUTRAL" &&
    normalize(tradeDecision) === "ENTER"
  );
}

function build(horizonSignal = {}, market = {}) {
  const horizon = normalize(horizonSignal.horizon);

  if (!VALID_HORIZONS.includes(horizon)) {
    throw new Error("HORIZON_SIGNAL_ADAPTER_INVALID_HORIZON");
  }

  const direction = normalize(horizonSignal.direction);
  const tradeable = isTradeable(
    direction,
    horizonSignal.tradeDecision
  );

  return Object.freeze({
    horizon,
    symbol:
      horizonSignal.symbol ||
      market.symbol ||
      market.displaySymbol ||
      null,
    signal: tradeable ? direction : "WAIT",
    direction,
    state: tradeable ? direction : "WAIT",
    confidence: Number.isFinite(Number(horizonSignal.confidence))
      ? Number(horizonSignal.confidence)
      : 0,
    tradeable,
    setupState:
      horizonSignal.setupState || "DEVELOPING",
    tradeDecision:
      normalize(horizonSignal.tradeDecision) || "WAIT",
    weightedScore:
      Number.isFinite(Number(horizonSignal.weightedScore))
        ? Number(horizonSignal.weightedScore)
        : 0,
    price:
      Number.isFinite(Number(market.price))
        ? Number(market.price)
        : null,
    availableTimeframes:
      Array.isArray(horizonSignal.availableTimeframes)
        ? [...horizonSignal.availableTimeframes]
        : [],
    timeframes:
      Array.isArray(horizonSignal.timeframes)
        ? [...horizonSignal.timeframes]
        : [],
    dataMode:
      horizonSignal.dataMode ||
      market.dataMode ||
      "UNKNOWN",
    reason:
      horizonSignal.reason ||
      (tradeable
        ? "HORIZON_ENTER"
        : "HORIZON_WAIT"),
    horizonSignal
  });
}

function buildAll(horizons = {}, market = {}) {
  return Object.freeze(
    Object.fromEntries(
      VALID_HORIZONS.map(horizon => [
        horizon,
        build(
          {
            ...(horizons[horizon] || {}),
            horizon
          },
          market
        )
      ])
    )
  );
}

const AfriForexHorizonSignalAdapter = Object.freeze({
  VALID_HORIZONS,
  build,
  buildAll
});

export default AfriForexHorizonSignalAdapter;
