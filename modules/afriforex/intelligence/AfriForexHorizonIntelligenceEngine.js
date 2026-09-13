const HORIZONS = Object.freeze({
  SCALP: Object.freeze(["1min", "5min", "15M", "1H"]),
  INTRADAY: Object.freeze(["5min", "15M", "1H", "4H"]),
  SWING: Object.freeze(["1H", "4H", "1D", "1W"]),
  POSITION: Object.freeze(["4H", "1D", "1W", "1MO"])
});

const HORIZON_WEIGHTS = Object.freeze({
  SCALP: Object.freeze({ "1min": 1, "5min": 2, "15M": 2, "1H": 1 }),
  INTRADAY: Object.freeze({ "5min": 1, "15M": 2, "1H": 2, "4H": 1 }),
  SWING: Object.freeze({ "1H": 1, "4H": 2, "1D": 2, "1W": 1 }),
  POSITION: Object.freeze({ "4H": 1, "1D": 2, "1W": 2, "1MO": 2 })
});

function finite(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sign(value) {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

function normalizeDirection(value) {
  const direction = String(value || "").toUpperCase();

  if (direction === "STRONG_BUY") return 2;
  if (direction === "BUY" || direction === "BULLISH") return 1;
  if (direction === "STRONG_SELL") return -2;
  if (direction === "SELL" || direction === "BEARISH") return -1;

  return 0;
}

function directionLabel(score) {
  if (score >= 5) return "STRONG_BUY";
  if (score > 0) return "BUY";
  if (score <= -5) return "STRONG_SELL";
  if (score < 0) return "SELL";
  return "NEUTRAL";
}

function confidenceFromEvidence({
  availableCount,
  totalCount,
  weightedScore,
  alignmentCount,
  conflictCount
}) {
  if (!availableCount) return 0;

  const coverage =
    totalCount > 0
      ? (availableCount / totalCount) * 30
      : 0;

  const directionalStrength =
    Math.min(40, Math.abs(weightedScore) * 8);

  const alignmentBonus =
    Math.min(20, alignmentCount * 5);

  const conflictPenalty =
    Math.min(25, conflictCount * 8);

  return Math.max(
    0,
    Math.min(
      95,
      Math.round(
        35 +
        coverage +
        directionalStrength +
        alignmentBonus -
        conflictPenalty
      )
    )
  );
}

function analyzeHorizon(name, timeframes, input = {}) {
  const candlesByTimeframe =
    input.candlesByTimeframe &&
    typeof input.candlesByTimeframe === "object"
      ? input.candlesByTimeframe
      : {};

  const existingEvidence =
    input.timeframeEvidence &&
    typeof input.timeframeEvidence === "object"
      ? input.timeframeEvidence
      : {};

  const weights = HORIZON_WEIGHTS[name] || {};

  const evidence = {};
  let weightedScore = 0;
  let availableCount = 0;
  let alignmentCount = 0;
  let conflictCount = 0;
  let firstDirection = 0;

  for (const timeframe of timeframes) {
    const source = existingEvidence[timeframe] || {};
    const candles = candlesByTimeframe[timeframe];

    const hasCandles =
      Array.isArray(candles) &&
      candles.length >= 3;

    const status =
      source.status === "AVAILABLE" || hasCandles
        ? "AVAILABLE"
        : "INSUFFICIENT_DATA";

    const sourceDirection =
      normalizeDirection(
        source.momentumDirection ||
        source.direction ||
        source.trend
      );

    const changePercent =
      finite(
        source.momentum?.changePercent ??
        source.evidencePercent ??
        source.changePercent
      );

    const direction =
      sourceDirection !== 0
        ? sourceDirection
        : sign(changePercent);

    if (status === "AVAILABLE") {
      availableCount += 1;

      const weight = Number(weights[timeframe]) || 1;
      weightedScore += direction * weight;

      if (direction !== 0) {
        if (firstDirection === 0) {
          firstDirection = direction;
        } else if (direction === firstDirection) {
          alignmentCount += 1;
        } else {
          conflictCount += 1;
        }
      }
    }

    evidence[timeframe] = {
      timeframe,
      status,
      evidencePercent: changePercent,
      direction: directionLabel(direction),
      trend:
        direction > 0
          ? "BULLISH"
          : direction < 0
            ? "BEARISH"
            : "UNKNOWN"
    };
  }

  const direction = directionLabel(weightedScore);

  let setupState = "DEVELOPING";

  const coverageComplete =
    availableCount === timeframes.length;

  const dominantDirection =
    weightedScore > 0 ? 1 :
    weightedScore < 0 ? -1 :
    0;

  let dominantWeight = 0;
  let opposingWeight = 0;

  for (const timeframe of timeframes) {
    const item = evidence[timeframe];

    if (!item || item.status !== "AVAILABLE") {
      continue;
    }

    const itemDirection = normalizeDirection(item.direction);
    const weight = Number(weights[timeframe]) || 1;

    if (dominantDirection !== 0 && itemDirection === dominantDirection) {
      dominantWeight += weight;
    } else if (dominantDirection !== 0 && itemDirection !== 0) {
      opposingWeight += weight;
    }
  }

  const strongAlignment =
    coverageComplete &&
    dominantDirection !== 0 &&
    dominantWeight > opposingWeight &&
    Math.abs(weightedScore) >= 3;

  if (!availableCount) {
    setupState = "INSUFFICIENT_DATA";
  } else if (dominantDirection === 0) {
    setupState = "DEVELOPING";
  } else if (strongAlignment) {
    setupState = "ALIGNMENT_CONFIRMED";
  } else if (opposingWeight > 0) {
    setupState = "CONFLICT";
  } else {
    setupState = "DEVELOPING";
  }

  const confidence = confidenceFromEvidence({
    availableCount,
    totalCount: timeframes.length,
    weightedScore,
    alignmentCount,
    conflictCount
  });

  const tradeDecision =
    setupState === "ALIGNMENT_CONFIRMED" &&
    direction !== "NEUTRAL" &&
    confidence >= 60
      ? "ENTER"
      : "WAIT";

  return {
    status:
      availableCount > 0
        ? "AVAILABLE"
        : "INSUFFICIENT_DATA",
    horizon: name,
    timeframes: [...timeframes],
    direction,
    setupState,
    tradeDecision,
    confidence,
    availableTimeframes: timeframes.filter(
      timeframe =>
        evidence[timeframe]?.status === "AVAILABLE"
    ),
    alignmentCount,
    conflictCount,
    weightedScore,
    evidence,
    reason:
      setupState === "ALIGNMENT_CONFIRMED"
        ? "HORIZON_ALIGNMENT_CONFIRMED"
        : setupState === "CONFLICT"
          ? "HORIZON_EVIDENCE_CONFLICT"
          : setupState === "INSUFFICIENT_DATA"
            ? "HORIZON_INSUFFICIENT_DATA"
            : "HORIZON_SETUP_DEVELOPING"
  };
}

function analyze(input = {}) {
  const result = {};

  for (const [name, timeframes] of Object.entries(HORIZONS)) {
      if (Array.isArray(input.excludeHorizons) && input.excludeHorizons.includes(name)) continue;
    result[name] = analyzeHorizon(
      name,
      timeframes,
      input
    );
  }

  return {
    status: Object.values(result).some(
      horizon => horizon.status === "AVAILABLE"
    )
      ? "AVAILABLE"
      : "INSUFFICIENT_DATA",
    symbol: input.symbol || null,
    dataMode: input.dataMode || "UNKNOWN",
    horizons: result
  };
}

const AfriForexHorizonIntelligenceEngine = Object.freeze({
  HORIZONS,
  analyze
});

export default AfriForexHorizonIntelligenceEngine;
