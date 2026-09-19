const finite = value => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

function normalizeCandles(candles = []) {
  if (!Array.isArray(candles)) return [];

  return candles
    .map(candle => ({
      high: finite(candle?.high),
      low: finite(candle?.low),
      close: finite(candle?.close ?? candle?.price),
      timestamp: candle?.timestamp ?? candle?.datetime ?? null
    }))
    .filter(candle =>
      candle.high !== null &&
      candle.low !== null &&
      candle.close !== null &&
      candle.high >= candle.low &&
      candle.close > 0
    )
    .sort((a, b) => {
      const ta = Date.parse(a.timestamp ?? 0);
      const tb = Date.parse(b.timestamp ?? 0);

      return (
        (Number.isFinite(ta) ? ta : 0) -
        (Number.isFinite(tb) ? tb : 0)
      );
    });
}

function findSwingLevels(candles, side, radius = 2) {
  const levels = [];

  for (let i = radius; i < candles.length - radius; i++) {
    const value =
      side === "RESISTANCE"
        ? candles[i].high
        : candles[i].low;

    let isSwing = true;

    for (let offset = 1; offset <= radius; offset++) {
      const left =
        side === "RESISTANCE"
          ? candles[i - offset].high
          : candles[i - offset].low;

      const right =
        side === "RESISTANCE"
          ? candles[i + offset].high
          : candles[i + offset].low;

      if (
        side === "RESISTANCE"
          ? value < left || value < right
          : value > left || value > right
      ) {
        isSwing = false;
        break;
      }
    }

    if (isSwing) {
      levels.push({
        price: value,
        index: i,
        timestamp: candles[i].timestamp
      });
    }
  }

  return levels;
}

function clusterLevels(levels, tolerancePercent) {
  const clusters = [];

  for (const level of levels) {
    const existing = clusters.find(cluster =>
      Math.abs((level.price - cluster.price) / cluster.price) * 100 <=
      tolerancePercent
    );

    if (existing) {
      existing.members.push(level);
      existing.price =
        existing.members.reduce((sum, item) => sum + item.price, 0) /
        existing.members.length;
    } else {
      clusters.push({
        price: level.price,
        members: [level]
      });
    }
  }

  return clusters.sort((a, b) => b.members.length - a.members.length);
}

function nearestBelow(clusters, price) {
  return clusters
    .filter(cluster => cluster.price < price)
    .sort((a, b) => b.price - a.price)[0] || null;
}

function nearestAbove(clusters, price) {
  return clusters
    .filter(cluster => cluster.price > price)
    .sort((a, b) => a.price - b.price)[0] || null;
}

function analyze(input = {}) {
  const candles = normalizeCandles(input.candles);

  if (candles.length < 7) {
    return {
      status: "INSUFFICIENT_DATA",
      symbol: input.symbol || null,
      timeframe: input.timeframe || null,
      structure: "UNKNOWN",
      trend: "UNKNOWN",
      breakout: false,
      reversal: false,
      support: null,
      resistance: null,
      supportDistancePercent: null,
      resistanceDistancePercent: null,
      location: "UNKNOWN",
      reason: "MARKET_STRUCTURE_REQUIRES_AT_LEAST_SEVEN_CANDLES"
    };
  }

  const currentPrice = candles[candles.length - 1].close;

  const recentRange = candles.slice(-20);
  const rangeHigh = Math.max(...recentRange.map(c => c.high));
  const rangeLow = Math.min(...recentRange.map(c => c.low));
  const rangePercent =
    rangeLow > 0
      ? ((rangeHigh - rangeLow) / rangeLow) * 100
      : 0;

  const tolerancePercent = clamp(rangePercent * 0.05, 0.05, 0.5);

  const supportLevels = clusterLevels(
    findSwingLevels(candles, "SUPPORT"),
    tolerancePercent
  );

  const resistanceLevels = clusterLevels(
    findSwingLevels(candles, "RESISTANCE"),
    tolerancePercent
  );

  const supportCluster = nearestBelow(supportLevels, currentPrice);
  const resistanceCluster = nearestAbove(resistanceLevels, currentPrice);

  const support = supportCluster?.price ?? null;
  const resistance = resistanceCluster?.price ?? null;

  const supportDistancePercent =
    support !== null
      ? ((currentPrice - support) / currentPrice) * 100
      : null;

  const resistanceDistancePercent =
    resistance !== null
      ? ((resistance - currentPrice) / currentPrice) * 100
      : null;

  const location =
    support !== null &&
    supportDistancePercent !== null &&
    supportDistancePercent <= tolerancePercent
      ? "NEAR_SUPPORT"
      : resistance !== null &&
        resistanceDistancePercent !== null &&
        resistanceDistancePercent <= tolerancePercent
        ? "NEAR_RESISTANCE"
        : "BETWEEN_LEVELS";

  const midpoint = Math.floor(candles.length / 2);
  const firstHalf = candles.slice(0, midpoint);
  const secondHalf = candles.slice(midpoint);

  const firstAverage =
    firstHalf.reduce((sum, candle) => sum + candle.close, 0) /
    firstHalf.length;

  const secondAverage =
    secondHalf.reduce((sum, candle) => sum + candle.close, 0) /
    secondHalf.length;

  const trend =
    secondAverage > firstAverage
      ? "BULLISH"
      : secondAverage < firstAverage
        ? "BEARISH"
        : "NEUTRAL";

  const previousHigh = Math.max(
    ...candles.slice(0, -1).map(candle => candle.high)
  );

  const previousLow = Math.min(
    ...candles.slice(0, -1).map(candle => candle.low)
  );

  const breakout =
    currentPrice > previousHigh ||
    currentPrice < previousLow;

  const previousClose = candles[candles.length - 2].close;
  const reversal =
    (trend === "BULLISH" && currentPrice < previousClose) ||
    (trend === "BEARISH" && currentPrice > previousClose);

  const structure =
    breakout
      ? currentPrice > previousHigh
        ? "BREAKOUT_UP"
        : "BREAKOUT_DOWN"
      : location === "NEAR_SUPPORT"
        ? "SUPPORT_TEST"
        : location === "NEAR_RESISTANCE"
          ? "RESISTANCE_TEST"
          : trend === "BULLISH"
            ? "HIGHER_STRUCTURE"
            : trend === "BEARISH"
              ? "LOWER_STRUCTURE"
              : "RANGE";

  return {
    status: "AVAILABLE",
    symbol: input.symbol || null,
    timeframe: input.timeframe || null,
    currentPrice,
    structure,
    trend,
    breakout,
    reversal,
    support,
    resistance,
    supportDistancePercent:
      supportDistancePercent === null
        ? null
        : Number(supportDistancePercent.toFixed(4)),
    resistanceDistancePercent:
      resistanceDistancePercent === null
        ? null
        : Number(resistanceDistancePercent.toFixed(4)),
    location,
    supportTouches: supportCluster?.members.length || 0,
    resistanceTouches: resistanceCluster?.members.length || 0,
    tolerancePercent: Number(tolerancePercent.toFixed(4)),
    reason:
      location === "NEAR_SUPPORT"
        ? "PRICE_NEAR_STRUCTURAL_SUPPORT"
        : location === "NEAR_RESISTANCE"
          ? "PRICE_NEAR_STRUCTURAL_RESISTANCE"
          : breakout
            ? "STRUCTURAL_BREAKOUT"
            : "PRICE_BETWEEN_STRUCTURAL_LEVELS"
  };
}

const AfriForexMarketStructureEngine = {
  analyze
};

export default Object.freeze(AfriForexMarketStructureEngine);
