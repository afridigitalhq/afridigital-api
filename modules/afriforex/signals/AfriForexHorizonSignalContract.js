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

const VALID_SETUP_STATES = Object.freeze([
  "INSUFFICIENT_DATA",
  "DEVELOPING",
  "CONFLICT",
  "ALIGNMENT_CONFIRMED"
]);

const VALID_TRADE_DECISIONS = Object.freeze([
  "ENTER",
  "WAIT"
]);

function normalize(value) {
  return String(value || "").toUpperCase();
}

function normalizeHorizon(value) {
  const horizon = normalize(value);
  return VALID_HORIZONS.includes(horizon) ? horizon : null;
}

function normalizeDirection(value) {
  const direction = normalize(value);
  return VALID_DIRECTIONS.includes(direction)
    ? direction
    : "NEUTRAL";
}

function normalizeSetupState(value) {
  const state = normalize(value);

  return VALID_SETUP_STATES.includes(state)
    ? state
    : "INSUFFICIENT_DATA";
}

function normalizeTradeDecision(value) {
  const decision = normalize(value);

  return VALID_TRADE_DECISIONS.includes(decision)
    ? decision
    : "WAIT";
}

function finite(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function build(input = {}) {
  const horizon = normalizeHorizon(input.horizon);

  if (!horizon) {
    throw new Error("HORIZON_SIGNAL_INVALID_HORIZON");
  }

  const direction = normalizeDirection(input.direction);

  return Object.freeze({
    horizon,
    symbol: input.symbol || null,
    direction,
    strength:
      direction === "STRONG_BUY" || direction === "STRONG_SELL"
        ? "STRONG"
        : direction === "NEUTRAL"
          ? "NEUTRAL"
          : "NORMAL",
    confidence: finite(input.confidence) ?? 0,
    setupState: normalizeSetupState(input.setupState),
    tradeDecision: normalizeTradeDecision(input.tradeDecision),
    weightedScore: finite(input.weightedScore) ?? 0,
    availableTimeframes: Array.isArray(input.availableTimeframes)
      ? [...input.availableTimeframes]
      : [],
    timeframes: Array.isArray(input.timeframes)
      ? [...input.timeframes]
      : [],
    evidence: input.evidence && typeof input.evidence === "object"
      ? input.evidence
      : {},
    dataMode: input.dataMode || "UNKNOWN",
    reason: input.reason || null
  });
}

function buildAll(input = {}) {
  const horizons =
    input.horizons &&
    typeof input.horizons === "object"
      ? input.horizons
      : {};

  return Object.freeze(
    Object.fromEntries(
      VALID_HORIZONS.map(horizon => [
        horizon,
        build({
          ...horizons[horizon],
          horizon,
          symbol: input.symbol ?? horizons[horizon]?.symbol,
          dataMode: input.dataMode ?? horizons[horizon]?.dataMode
        })
      ])
    )
  );
}

const AfriForexHorizonSignalContract = Object.freeze({
  VALID_HORIZONS,
  VALID_DIRECTIONS,
  VALID_SETUP_STATES,
  VALID_TRADE_DECISIONS,
  build,
  buildAll
});

export default AfriForexHorizonSignalContract;
