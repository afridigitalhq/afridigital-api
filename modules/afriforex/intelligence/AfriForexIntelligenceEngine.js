import AfriForexIndicatorEngine from "../analysis/indicators/AfriForexIndicatorEngine.js";
import AfriForexMomentumEngine from "../analysis/AfriForexMomentumEngine.js";
import AfriForexMarketStructureEngine from "../analysis/structure/AfriForexMarketStructureEngine.js";

const TIMEFRAME_WEIGHTS = Object.freeze({
  "1D": 1,
  "4H": 3,
  "1H": 3,
  "15M": 3,
  "5min": 4,
  "1min": 2
});

const TIMEFRAMES = Object.freeze([
  "1D",
  "4H",
  "1H",
  "15M",
  "5min",
  "1min"
]);

function finite(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sign(value) {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

function directionFromScore(score) {
  if (score >= 5) return "STRONG_BUY";
  if (score >= 2) return "BUY";
  if (score <= -5) return "STRONG_SELL";
  if (score <= -2) return "SELL";
  return "NEUTRAL";
}

function normalizeDirection(value) {
  const direction = String(value || "").toUpperCase();

  if (direction === "BUY") return 1;
  if (direction === "SELL") return -1;

  return 0;
}

function indicatorScore(result = {}) {
  const indicators = result?.indicators || {};

  let score = 0;

  const ema20 = finite(indicators.ema20);
  const ema50 = finite(indicators.ema50);
  const ema200 = finite(indicators.ema200);
  const rsi = finite(indicators.rsi14);
  const macdHistogram = finite(indicators.macd?.histogram);

  if (ema20 !== null && ema50 !== null) {
    score += sign(ema20 - ema50);
  }

  if (ema50 !== null && ema200 !== null) {
    score += sign(ema50 - ema200);
  }

  if (rsi !== null) {
    if (rsi >= 55) score += 1;
    else if (rsi <= 45) score -= 1;
  }

  if (macdHistogram !== null) {
    score += sign(macdHistogram);
  }

  return score;
}

function buildTimeframeEvidence(symbol, timeframe, candles) {
  if (!Array.isArray(candles) || candles.length < 3) {
    return {
      timeframe,
      status: "INSUFFICIENT_DATA",
      score: 0,
      indicatorScore: 0,
      momentumScore: 0,
      indicatorDirection: "NEUTRAL",
      momentumDirection: "NEUTRAL",
      indicators: null,
      momentum: null,
      marketStructure: null
    };
  }

  const indicators = AfriForexIndicatorEngine.analyze({
    symbol,
    timeframe,
    candles
  });

  const momentum = AfriForexMomentumEngine.analyze({
    symbol,
    timeframe,
    candles
  });

  const marketStructure = AfriForexMarketStructureEngine.analyze({
    symbol,
    timeframe,
    candles
  });

  const iScore = indicatorScore(indicators);
  const mScore = normalizeDirection(momentum?.direction);

  const combinedScore =
    iScore + mScore;

  const direction =
    combinedScore > 0
      ? "BUY"
      : combinedScore < 0
        ? "SELL"
        : "NEUTRAL";

  return {
    timeframe,
    status: "AVAILABLE",
    score: combinedScore,
    direction,
    indicatorScore: iScore,
    momentumScore: mScore,
    indicatorDirection:
      iScore > 0 ? "BUY" :
      iScore < 0 ? "SELL" :
      "NEUTRAL",
    momentumDirection:
      mScore > 0 ? "BUY" :
      mScore < 0 ? "SELL" :
      "NEUTRAL",
    indicators,
    momentum,
    marketStructure
  };
}

function collectCandles(input = {}) {
  if (
    input.candlesByTimeframe &&
    typeof input.candlesByTimeframe === "object"
  ) {
    return input.candlesByTimeframe;
  }

  if (input.candles && Array.isArray(input.candles)) {
    return {
      [input.timeframe || "15M"]: input.candles
    };
  }

  return {};
}

function analyze(input = {}) {
  const symbol = input.symbol || null;
  const candlesByTimeframe = collectCandles(input);

  const timeframeEvidence = {};
  let weightedScore = 0;
  let availableCount = 0;

  for (const timeframe of TIMEFRAMES) {
    const result = buildTimeframeEvidence(
      symbol,
      timeframe,
      candlesByTimeframe[timeframe]
    );

    timeframeEvidence[timeframe] = result;

    if (result.status !== "AVAILABLE") continue;

    availableCount += 1;

    if (["1H", "15M", "5min", "1min"].includes(timeframe)) {
      weightedScore +=
        result.score *
        (TIMEFRAME_WEIGHTS[timeframe] || 1);
    }
  }

  const primary = timeframeEvidence["4H"];
  const confirmation = timeframeEvidence["1H"];
  const scalpConfirmation = timeframeEvidence["15M"];
  const scalpSetup = timeframeEvidence["5min"];
  const entryTiming = timeframeEvidence["1min"];
  const entry = scalpConfirmation;
  const higher = timeframeEvidence["1D"];

  const primaryDirection = sign(primary?.score || 0);
  const confirmationDirection = sign(confirmation?.score || 0);
  const scalpConfirmationDirection = sign(scalpConfirmation?.score || 0);
  const scalpSetupDirection = sign(scalpSetup?.score || 0);
  const entryTimingDirection = sign(entryTiming?.score || 0);
  const entryDirection = scalpConfirmationDirection;
  const scalpDirection = sign(
    scalpSetup?.score || scalpConfirmation?.score || 0
  );
  const higherDirection = sign(higher?.score || 0);

  const primaryIndicatorDirection =
    normalizeDirection(primary?.indicatorDirection);

  const primaryMomentumDirection =
    normalizeDirection(primary?.momentumDirection);

  const confirmationIndicatorDirection =
    normalizeDirection(confirmation?.indicatorDirection);

  const confirmationMomentumDirection =
    normalizeDirection(confirmation?.momentumDirection);

  const higherIndicatorDirection =
    normalizeDirection(higher?.indicatorDirection);

  const higherMomentumDirection =
    normalizeDirection(higher?.momentumDirection);

  const primaryEvidenceConflict =
    primaryIndicatorDirection !== 0 &&
    primaryMomentumDirection !== 0 &&
    primaryIndicatorDirection !== primaryMomentumDirection;

  const confirmationEvidenceConflict =
    confirmationIndicatorDirection !== 0 &&
    confirmationMomentumDirection !== 0 &&
    confirmationIndicatorDirection !== confirmationMomentumDirection;

  const higherEvidenceConflict =
    higherIndicatorDirection !== 0 &&
    higherMomentumDirection !== 0 &&
    higherIndicatorDirection !== higherMomentumDirection;

  const primaryConfirmationAligned =
    primaryDirection !== 0 &&
    confirmationDirection !== 0 &&
    primaryDirection === confirmationDirection &&
    !primaryEvidenceConflict &&
    !confirmationEvidenceConflict;

  const entryAligned =
    primaryConfirmationAligned &&
    entryDirection === primaryDirection;

  const higherConflict =
    higherEvidenceConflict ||
    (
      higherDirection !== 0 &&
      primaryDirection !== 0 &&
      higherDirection !== primaryDirection
    );

  const scalpConfirmationAligned =
    confirmationDirection !== 0 &&
    scalpConfirmationDirection !== 0 &&
    confirmationDirection === scalpConfirmationDirection;

  const scalpSetupAligned =
    scalpConfirmationAligned &&
    scalpSetupDirection !== 0 &&
    scalpSetupDirection === scalpConfirmationDirection;

  const entryTimingAligned =
    entryTimingDirection === 0 ||
    entryTimingDirection === scalpSetupDirection;

  const scalpTimingConflict =
    scalpSetupDirection !== 0 &&
    entryTimingDirection !== 0 &&
    entryTimingDirection !== scalpSetupDirection;

  const lowerTimeframeReversal =
    primaryDirection !== 0 &&
    scalpSetupDirection !== 0 &&
    primaryDirection !== scalpSetupDirection;

  const structuralConflict =
    confirmationEvidenceConflict ||
    scalpTimingConflict ||
    (scalpSetupDirection !== 0 &&
      scalpConfirmationDirection !== 0 &&
      scalpSetupDirection !== scalpConfirmationDirection);

  const scalpCanonicalAligned =
    scalpSetupDirection !== 0 &&
    scalpConfirmationDirection !== 0 &&
    scalpSetupDirection === scalpConfirmationDirection &&
    entryTimingAligned;

  let direction = "NEUTRAL";

  if (scalpSetupDirection !== 0) {
    direction = scalpSetupDirection > 0 ? "BUY" : "SELL";
  } else if (scalpConfirmationDirection !== 0) {
    direction = scalpConfirmationDirection > 0 ? "BUY" : "SELL";
  } else if (entryTimingDirection !== 0) {
    direction = entryTimingDirection > 0 ? "BUY" : "SELL";
  } else {
    direction = directionFromScore(weightedScore);
  }

  let setupState = "DEVELOPING";

  if (structuralConflict) {
    setupState = "CONFLICT";
  } else if (scalpCanonicalAligned) {
    setupState = "ALIGNMENT_CONFIRMED";
  }

  const scalpRegime = structuralConflict
    ? "CONFLICT"
    : scalpDirection === 0 || !scalpCanonicalAligned
      ? "NEUTRAL_NOISE"
      : primaryDirection !== 0 &&
        confirmationDirection !== 0 &&
        primaryDirection === confirmationDirection &&
        primaryDirection === scalpDirection &&
        !primaryEvidenceConflict &&
        !confirmationEvidenceConflict
        ? "DIRECTIONAL"
        : "DEVELOPING";

  if (setupState === "CONFLICT") {
    if (direction === "STRONG_BUY") direction = "BUY";
    if (direction === "STRONG_SELL") direction = "SELL";
  }

  const entryMomentumStrengthPercent =
    Number.isFinite(entryTiming?.momentum?.strengthPercent)
      ? entryTiming.momentum.strengthPercent
      : 0;

  const entryMomentumDirection =
    normalizeDirection(entryTiming?.momentum?.direction);

  const entryMarketStructure =
    entryTiming?.marketStructure || null;

  const entryMomentumAligned =
    entryMomentumDirection !== 0 &&
    entryMomentumDirection === scalpSetupDirection &&
    entryMomentumStrengthPercent >= 30;

  const entryStructureAvailable =
    entryMarketStructure?.status === "AVAILABLE";

  const entryLocationBlocked =
    scalpSetupDirection > 0
      ? entryMarketStructure?.location === "NEAR_RESISTANCE"
      : scalpSetupDirection < 0
        ? entryMarketStructure?.location === "NEAR_SUPPORT"
        : true;

  const entryLocationConfirmed =
    entryStructureAvailable &&
    !entryLocationBlocked;

  let tradeDecision = "WAIT";

  if (
    scalpRegime === "DIRECTIONAL" &&
    setupState === "ALIGNMENT_CONFIRMED" &&
    scalpSetupDirection === scalpConfirmationDirection &&
    entryMomentumAligned &&
    entryLocationConfirmed
  ) {
    tradeDecision = "ENTER";
  }

  const economicCalendar =
    input.economicCalendar &&
    typeof input.economicCalendar === "object"
      ? input.economicCalendar
      : null;

  const economicCalendarProtection =
    economicCalendar?.status === "AVAILABLE" &&
    economicCalendar?.imminent === true &&
    Array.isArray(economicCalendar?.imminentEvents) &&
    economicCalendar.imminentEvents.length > 0;

  if (economicCalendarProtection) {
    tradeDecision = "WAIT";
  }

  const evidenceStrength =
    Math.min(
      TIMEFRAMES.length,
      availableCount
    ) * 5;

  const directionalStrength =
    Math.min(
      35,
      Math.abs(weightedScore) * 5
    );

  const conflictPenalty =
    higherConflict
      ? 15
      : primaryEvidenceConflict
        ? 15
        : confirmationEvidenceConflict
          ? 8
          : lowerTimeframeReversal
            ? 8
            : scalpTimingConflict
              ? 5
              : 0;

  const confidence = Math.max(
    0,
    Math.min(
      95,
      Math.round(
        45 +
        evidenceStrength +
        directionalStrength -
        conflictPenalty
      )
    )
  );

  const scalpMomentumWeights = {
    "1min": 2,
    "5min": 4,
    "15M": 3,
    "1H": 3
  };

  const scalpMomentumEntries = Object.entries(
    scalpMomentumWeights
  )
    .map(([timeframe, weight]) => {
      const momentum = timeframeEvidence[timeframe]?.momentum || {};
      const strengthPercent = finite(momentum?.strengthPercent);
      const direction = normalizeDirection(momentum?.direction);

      return {
        strengthPercent,
        direction,
        weight
      };
    })
    .filter(item => item.strengthPercent !== null);

  const scalpMomentumWeightTotal =
    scalpMomentumEntries.reduce(
      (sum, item) => sum + item.weight,
      0
    );

  const scalpDirectionSign = scalpDirection;

  const scalpMomentumAlignmentScore =
    scalpMomentumWeightTotal > 0 && scalpDirectionSign !== 0
      ? scalpMomentumEntries.reduce(
          (sum, item) => {
            const momentumSign =
              item.direction === "BUY"
                ? 1
                : item.direction === "SELL"
                  ? -1
                  : 0;

            return sum +
              item.strengthPercent *
              momentumSign *
              scalpDirectionSign *
              item.weight;
          },
          0
        ) / scalpMomentumWeightTotal
      : 0;

  const scalpMomentumStrengthPercent =
    scalpMomentumWeightTotal > 0 && scalpDirectionSign !== 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round((scalpMomentumAlignmentScore + 100) / 2)
          )
        )
      : 0;

  const reversal =
    lowerTimeframeReversal || scalpTimingConflict
      ? {
          status: scalpTimingConflict
            ? "SCALP_TIMING_REVERSAL_DEVELOPING"
            : "REVERSAL_DEVELOPING",
          direction:
            (scalpSetupDirection || entryTimingDirection) > 0
              ? "BUY"
              : "SELL"
        }
      : {
          status: "NONE",
          direction: null
        };

  const visualTimeframes = [
    "1min",
    "5min",
    "15M",
    "30M",
    "1H",
    "4H",
    "1D",
    "1W",
    "1MO",
    "1Y"
  ];

  const timeframeEvidenceView = visualTimeframes.map(timeframe => {
    const intelligence = timeframeEvidence[timeframe] || {};

    const evidencePercent =
      finite(intelligence?.momentum?.changePercent);

    const direction =
      normalizeDirection(intelligence?.direction) !== 0
        ? normalizeDirection(intelligence?.direction) > 0
          ? "BUY"
          : "SELL"
        : "NEUTRAL";

    return {
      timeframe,
      status:
        intelligence?.status === "AVAILABLE"
          ? "AVAILABLE"
          : intelligence?.status ||
            "INSUFFICIENT_DATA",
      evidencePercent,
      direction,
      trend:
        direction === "BUY"
          ? "BULLISH"
          : direction === "SELL"
            ? "BEARISH"
            : "UNKNOWN"
    };
  });

  return {
    status:
      availableCount > 0
        ? "AVAILABLE"
        : "INSUFFICIENT_DATA",

    symbol,
    direction,
    setupState,
    scalpRegime,
    tradeDecision,
    reversal,
    confidence,
    scalpMomentumStrengthPercent,
    economicCalendarProtection,
    economicCalendarReason:
      economicCalendarProtection
        ? "HIGH_IMPACT_EVENT_IMMINENT"
        : null,
    timeframeEvidence: timeframeEvidenceView,

    evidence: {
      indicators: timeframeEvidence,
      momentum: timeframeEvidence,
      marketStructure: Object.fromEntries(
        TIMEFRAMES.map(timeframe => [
          timeframe,
          timeframeEvidence[timeframe]?.marketStructure || null
        ])
      ),
      economicCalendar:
        input.economicCalendar || null
    },

    scoring: {
      weightedScore,
      availableTimeframes: availableCount,
      primaryScore: primary?.score || 0,
      confirmationScore: confirmation?.score || 0,
      entryScore: entry?.score || 0,
      higherTimeframeScore: higher?.score || 0,
      scalpScore: scalpConfirmation?.score || 0,
      scalpConfirmationScore: scalpConfirmation?.score || 0,
      scalpSetupScore: scalpSetup?.score || 0,
      entryTimingScore: entryTiming?.score || 0,
      mtfScore: 0,
      primaryConfirmationAligned,
      entryAligned,
      scalpConfirmationAligned,
      scalpSetupAligned,
      entryTimingAligned,
      scalpTimingConflict,
      higherConflict,
      lowerTimeframeReversal
    },

    scalp: {
      direction:
        scalpDirectionSign > 0
          ? "BUY"
          : scalpDirectionSign < 0
          ? "SELL"
          : "NEUTRAL",
      score: scalpSetup?.score || scalpConfirmation?.score || 0,
      confirmation: scalpConfirmationDirection > 0
        ? "BUY"
        : scalpConfirmationDirection < 0
        ? "SELL"
        : "NEUTRAL",
      setup: scalpSetupDirection > 0
        ? "BUY"
        : scalpSetupDirection < 0
        ? "SELL"
        : "NEUTRAL",
      entryTiming: entryTimingDirection > 0
        ? "BUY"
        : entryTimingDirection < 0
        ? "SELL"
        : "NEUTRAL",
      setupAligned: scalpSetupAligned,
      timingAligned: entryTimingAligned,
      timingConflict: scalpTimingConflict
    },

    reason:
      setupState === "ALIGNMENT_CONFIRMED"
        ? "MULTI_LAYER_ALIGNMENT_CONFIRMED"
        : setupState === "CONFLICT"
          ? "MULTI_LAYER_EVIDENCE_CONFLICT"
          : "MULTI_LAYER_SETUP_DEVELOPING"
  };
}

const AfriForexIntelligenceEngine = Object.freeze({
  analyze
});

export default AfriForexIntelligenceEngine;
