import AfriTradingProviderAggregator from "../../afriai/trading/intelligence/AfriTradingProviderAggregator.js";
import AfriForexCrossAssetUniverse from "./AfriForexCrossAssetUniverse.js";
import AfriForexCrossAssetRelevanceSelector from "./AfriForexCrossAssetRelevanceSelector.js";

const SCALP_TIMEFRAMES = Object.freeze(["1min", "5min", "15M", "1H"]);

const CORRELATION_THRESHOLDS = Object.freeze({
  strong: 0.7,
  moderate: 0.4,
  neutral: 0.2
});

const MIN_OBSERVATIONS = 8;

const RELATIONSHIP_ORIENTATION = Object.freeze({
  "XAU/USD:DXY": -1,
  "DXY:XAU/USD": -1,
  "XAG/USD:DXY": -1,
  "DXY:XAG/USD": -1,
  "EUR/USD:DXY": -1,
  "DXY:EUR/USD": -1,
  "GBP/USD:DXY": -1,
  "DXY:GBP/USD": -1,
  "AUD/USD:DXY": -1,
  "DXY:AUD/USD": -1,
  "NZD/USD:DXY": -1,
  "DXY:NZD/USD": -1
});

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeDirection(value) {
  const direction = String(value || "").toUpperCase();

  if (direction.includes("BUY")) return "BUY";
  if (direction.includes("SELL")) return "SELL";

  return "NEUTRAL";
}

function normalizeCandles(candles = []) {
  return candles
    .map((candle) => ({
      timestamp: candle?.timestamp ?? null,
      close: finite(candle?.close)
    }))
    .filter((candle) => candle.close !== null);
}

function returnsFromCandles(candles = []) {
  const normalized = normalizeCandles(candles);
  const returns = [];

  for (let index = 1; index < normalized.length; index += 1) {
    const previous = normalized[index - 1].close;
    const current = normalized[index].close;

    if (
      previous === null ||
      current === null ||
      previous === 0
    ) {
      continue;
    }

    returns.push({
      timestamp: normalized[index].timestamp,
      value: (current - previous) / previous
    });
  }

  return returns;
}

function pearsonCorrelation(left = [], right = []) {
  const count = Math.min(left.length, right.length);

  if (count < MIN_OBSERVATIONS) return null;

  const x = left.slice(0, count);
  const y = right.slice(0, count);

  const meanX = x.reduce((sum, value) => sum + value, 0) / count;
  const meanY = y.reduce((sum, value) => sum + value, 0) / count;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let index = 0; index < count; index += 1) {
    const dx = x[index] - meanX;
    const dy = y[index] - meanY;

    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  if (denominatorX === 0 || denominatorY === 0) return null;

  return numerator / Math.sqrt(denominatorX * denominatorY);
}

function correlationStrength(correlation) {
  if (!Number.isFinite(correlation)) return "UNAVAILABLE";

  const absolute = Math.abs(correlation);

  if (absolute >= CORRELATION_THRESHOLDS.strong) return "STRONG";
  if (absolute >= CORRELATION_THRESHOLDS.moderate) return "MODERATE";
  if (absolute >= CORRELATION_THRESHOLDS.neutral) return "WEAK";

  return "NEUTRAL";
}

function classifyCorrelation(
  correlation,
  scalpDirection,
  referenceSymbol,
  candidateSymbol
) {
  if (!Number.isFinite(correlation)) return "UNAVAILABLE";

  const direction = normalizeDirection(scalpDirection);
  const absolute = Math.abs(correlation);

  if (
    direction === "NEUTRAL" ||
    absolute < CORRELATION_THRESHOLDS.neutral
  ) {
    return "NEUTRAL";
  }

  const relationshipKey =
    `${String(referenceSymbol || "").toUpperCase()}:${String(candidateSymbol || "").toUpperCase()}`;

  const orientation =
    RELATIONSHIP_ORIENTATION[relationshipKey] ?? 1;

  const directionalEffect = correlation * orientation;

  /*
   * orientation = +1:
   *   candidate moving with the reference supports the same direction.
   *
   * orientation = -1:
   *   candidate moving inversely to the reference supports the
   *   reference's directional thesis.
   *
   * This makes structurally inverse relationships direction-aware.
   */
  if (directionalEffect > 0) return "SUPPORTING";

  return "AGAINST";
}

function getTimeframeCandles(candleEvidence, timeframe) {
  for (const providerResult of candleEvidence?.results || []) {
    const item = providerResult?.timeframes?.[timeframe];

    if (
      item?.status === "AVAILABLE" &&
      item?.evidence?.data?.candles?.length
    ) {
      return item.evidence.data.candles;
    }
  }

  return [];
}

function getAvailableTimeframes(candleEvidence) {
  return SCALP_TIMEFRAMES.filter(
    (timeframe) =>
      getTimeframeCandles(candleEvidence, timeframe).length > 0
  );
}

function calculateMultiTimeframeCorrelation(
  referenceCandleEvidence,
  candidateCandleEvidence
) {
  const timeframeResults = [];

  for (const timeframe of SCALP_TIMEFRAMES) {
    const referenceCandles = getTimeframeCandles(
      referenceCandleEvidence,
      timeframe
    );
    const candidateCandles = getTimeframeCandles(
      candidateCandleEvidence,
      timeframe
    );

    if (!referenceCandles.length || !candidateCandles.length) {
      timeframeResults.push({
        timeframe,
        correlation: null,
        observations: 0,
        status: "UNAVAILABLE"
      });
      continue;
    }

    const referenceReturns = returnsFromCandles(referenceCandles);
    const candidateReturns = returnsFromCandles(candidateCandles);
    const aligned = alignReturns(referenceReturns, candidateReturns);
    const correlation = pearsonCorrelation(
      aligned.reference,
      aligned.candidate
    );

    timeframeResults.push({
      timeframe,
      correlation,
      observations: aligned.reference.length,
      status: Number.isFinite(correlation)
        ? "AVAILABLE"
        : "UNAVAILABLE"
    });
  }

  const usable = timeframeResults.filter(
    (item) =>
      item.status === "AVAILABLE" &&
      Number.isFinite(item.correlation)
  );

  if (!usable.length) {
    return {
      correlation: null,
      observations: 0,
      timeframeResults
    };
  }

  const weighted = usable.reduce(
    (sum, item) => sum + item.correlation * Math.max(item.observations, 1),
    0
  );

  const totalWeight = usable.reduce(
    (sum, item) => sum + Math.max(item.observations, 1),
    0
  );

  return {
    correlation: weighted / totalWeight,
    observations: usable.reduce(
      (sum, item) => sum + item.observations,
      0
    ),
    timeframeResults
  };
}

function alignReturns(referenceReturns, candidateReturns) {
  const candidateByTimestamp = new Map(
    candidateReturns
      .filter((item) => item.timestamp != null)
      .map((item) => [String(item.timestamp), item.value])
  );

  const reference = [];
  const candidate = [];

  for (const item of referenceReturns) {
    if (item.timestamp == null) continue;

    const value = candidateByTimestamp.get(String(item.timestamp));

    if (!Number.isFinite(value)) continue;

    reference.push(item.value);
    candidate.push(value);
  }

  return { reference, candidate };
}

async function collectAsset(asset) {
  try {
    const candleEvidence =
      await AfriTradingProviderAggregator.collectCandles({
        assetType: asset.assetType,
        symbol: asset.symbol,
        timeframes: SCALP_TIMEFRAMES,
        outputsize: 100
      });

    return {
      asset,
      status: candleEvidence?.status || "NO_USABLE_PROVIDER",
      candleEvidence
    };
  } catch (error) {
    return {
      asset,
      status: "ERROR",
      reason: "CROSS_ASSET_PROVIDER_REQUEST_FAILED",
      error: error?.message || String(error)
    };
  }
}

async function analyzeAsset({
  referenceCandleEvidence,
  candidate,
  scalpDirection,
  referenceSymbol
}) {
  const referenceAvailableTimeframes = getAvailableTimeframes(referenceCandleEvidence);
  const candidateAvailableTimeframes = getAvailableTimeframes(candidate.candleEvidence);
  const mtfCorrelation = calculateMultiTimeframeCorrelation(
    referenceCandleEvidence,
    candidate.candleEvidence
  );
  const correlation = mtfCorrelation.correlation;

  if (!Number.isFinite(correlation)) {
    return {
      ...candidate.asset,
      classification: "UNAVAILABLE",
      correlation: null,
      correlationStrength: "UNAVAILABLE",
      timeframe: "SCALP_MTF",
      timeframes: SCALP_TIMEFRAMES,
      availableTimeframes: candidateAvailableTimeframes,
      referenceAvailableTimeframes,
      timeframeResults: mtfCorrelation.timeframeResults,
      observations: mtfCorrelation.observations,
      reason: "INSUFFICIENT_CORRELATION_DATA"
    };
  }

  const classification = classifyCorrelation(
    correlation,
    scalpDirection,
    referenceSymbol,
    candidate.asset?.symbol
  );

  return {
    ...candidate.asset,
    classification,
    correlation,
    correlationStrength: correlationStrength(correlation),
    timeframe: "SCALP_MTF",
    timeframes: SCALP_TIMEFRAMES,
    availableTimeframes: candidateAvailableTimeframes,
    referenceAvailableTimeframes,
    timeframeResults: mtfCorrelation.timeframeResults,
    observations: mtfCorrelation.observations,
    reason: "CORRELATION_EVALUATED"
  };
}
async function analyze({
  symbol,
  assetType,
  scalpSignal,
  referenceCandleEvidence,
  universe = AfriForexCrossAssetUniverse
}) {
  const scalpDirection = normalizeDirection(scalpSignal?.direction);
  const scalpConfidence = finite(scalpSignal?.confidence) ?? 0;
  const referenceAvailableTimeframes = getAvailableTimeframes(referenceCandleEvidence);

  if (!referenceAvailableTimeframes.length) {
    return Object.freeze({
      status: "UNAVAILABLE",
      symbol,
      driver: "SCALP",
      scalpDirection,
      scalpConfidence,
      bias: "UNAVAILABLE",
      confidence: 0,
      counts: {
        supporting: 0,
        against: 0,
        neutral: 0,
        unavailable: universe.length
      },
      evaluatedAssets: 0,
      universeSize: universe.length,
      referenceAvailableTimeframes,
      assets: universe.map((asset) => ({
        ...asset,
        classification: "UNAVAILABLE",
        correlation: null,
        correlationStrength: "UNAVAILABLE",
        timeframe: "SCALP_MTF",
        timeframes: SCALP_TIMEFRAMES,
        availableTimeframes: [],
        referenceAvailableTimeframes,
        timeframeResults: [],
        observations: 0,
        reason: "REFERENCE_SCALP_CANDLE_DATA_UNAVAILABLE"
      }))
    });
  }

  const selectedUniverse = AfriForexCrossAssetRelevanceSelector.select(
    symbol,
    assetType,
    universe
  );

  const candidates = selectedUniverse.filter(
    (asset) =>
      String(asset.symbol || "").toUpperCase() !==
      String(symbol || "").toUpperCase()
  );

  const results = [];

  for (const asset of candidates) {
    const collected = await collectAsset(asset);

    results.push(
      await analyzeAsset({
        referenceCandleEvidence,
        candidate: collected,
        scalpDirection,
        referenceSymbol: symbol
      })
    );
  }

  const supporting = results.filter(
    (item) => item.classification === "SUPPORTING"
  );

  const against = results.filter(
    (item) => item.classification === "AGAINST"
  );

  const neutral = results.filter(
    (item) => item.classification === "NEUTRAL"
  );

  const unavailable = results.filter(
    (item) => item.classification === "UNAVAILABLE"
  );

  const usable = [...supporting, ...against, ...neutral];

  const supportingWeight = supporting.reduce(
    (sum, item) => sum + Math.abs(item.correlation || 0),
    0
  );

  const againstWeight = against.reduce(
    (sum, item) => sum + Math.abs(item.correlation || 0),
    0
  );

  const totalWeight = supportingWeight + againstWeight;

  const supportRatio =
    totalWeight > 0
      ? supportingWeight / totalWeight
      : 0;

  const againstRatio =
    totalWeight > 0
      ? againstWeight / totalWeight
      : 0;

  let bias = "NEUTRAL";

  if (supporting.length > against.length && supportRatio >= 0.55) {
    bias = scalpDirection === "SELL" ? "BEARISH" : "BULLISH";
  } else if (against.length > supporting.length && againstRatio >= 0.55) {
    bias = scalpDirection === "SELL" ? "BULLISH" : "BEARISH";
  }

  const coverage =
    candidates.length > 0
      ? usable.length / candidates.length
      : 0;

  const directionalBalance = Math.abs(
    supportRatio - againstRatio
  );

  const confidence = Math.round(
    Math.max(
      0,
      Math.min(
        1,
        directionalBalance * 0.7 + coverage * 0.3
      )
    ) * 100
  );

  const evidence =
    bias === "UNAVAILABLE"
      ? "UNAVAILABLE"
      : bias === "NEUTRAL"
        ? "NEUTRAL"
        : bias === (scalpDirection === "SELL" ? "BEARISH" : "BULLISH")
          ? "SUPPORTIVE"
          : "AGAINST";

  return Object.freeze({
    status: "AVAILABLE",
    symbol,
    driver: "SCALP",
    scalpDirection,
    scalpConfidence,
    bias,
    evidence,
    confidence,
    referenceAvailableTimeframes,
    counts: {
      supporting: supporting.length,
      against: against.length,
      neutral: neutral.length,
      unavailable: unavailable.length
    },
    evaluatedAssets: usable.length,
    universeSize: universe.length,
    selectedUniverseSize: selectedUniverse.length,
    candidateCount: candidates.length,
    assets: results
  });
}
const AfriForexCrossAssetContextEngine = Object.freeze({
  SCALP_TIMEFRAMES,
  CORRELATION_THRESHOLDS,
  RELATIONSHIP_ORIENTATION,
  analyze
});

export default AfriForexCrossAssetContextEngine;
