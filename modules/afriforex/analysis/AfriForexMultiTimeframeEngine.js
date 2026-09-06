const TIMEFRAME_ORDER = [
  "1min",
  "5min",
  "15M",
  "1H",
  "4H",
  "1D",
  "1W",
  "1MO",
  "1Y"
];

const HIGHER_TIMEFRAMES = ["1Y", "1MO", "1W", "1D"];
const PRIMARY_TIMEFRAME = "4H";
const CONFIRMATION_TIMEFRAME = "1H";
const ENTRY_TIMEFRAMES = ["15M", "5min", "1min"];

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function chronological(candles = []) {
  return [...candles].sort(
    (a, b) => String(a.timestamp).localeCompare(String(b.timestamp))
  );
}

function analyzeTimeframe(timeframe, inputCandles = []) {
  const candles = chronological(inputCandles).filter(candle =>
    finite(candle.open) !== null &&
    finite(candle.high) !== null &&
    finite(candle.low) !== null &&
    finite(candle.close) !== null
  );

  if (candles.length < 2) {
    return {
      timeframe,
      status: "INSUFFICIENT_DATA",
      candles: candles.length,
      trend: "UNKNOWN",
      momentum: 0,
      changePercent: null,
      rangePercent: null
    };
  }

  const first = candles[0];
  const latest = candles[candles.length - 1];

  const open = finite(first.open);
  const close = finite(latest.close);
  const high = Math.max(...candles.map(candle => finite(candle.high)));
  const low = Math.min(...candles.map(candle => finite(candle.low)));

  const changePercent =
    open && close
      ? ((close - open) / open) * 100
      : null;

  const rangePercent =
    low > 0
      ? ((high - low) / low) * 100
      : null;

  const momentum =
    changePercent === null
      ? 0
      : changePercent > 0.25
        ? 1
        : changePercent < -0.25
          ? -1
          : 0;

  const trend =
    momentum > 0
      ? "BULLISH"
      : momentum < 0
        ? "BEARISH"
        : "NEUTRAL";

  return {
    timeframe,
    status: "AVAILABLE",
    candles: candles.length,
    latestClose: close,
    changePercent,
    rangePercent,
    momentum,
    trend
  };
}

const AfriForexMultiTimeframeEngine = {
  timeframes: [...TIMEFRAME_ORDER],
  primaryTimeframe: PRIMARY_TIMEFRAME,
  confirmationTimeframe: CONFIRMATION_TIMEFRAME,

  analyze(input = {}) {
    const source = input.timeframes || input.candles || {};
    const analyses = {};

    for (const timeframe of TIMEFRAME_ORDER) {
      const candles =
        source?.[timeframe]?.data?.candles ||
        source?.[timeframe]?.candles ||
        [];

      analyses[timeframe] = analyzeTimeframe(timeframe, candles);
    }

    const available = TIMEFRAME_ORDER.filter(
      timeframe => analyses[timeframe].status === "AVAILABLE"
    );

    const primary = analyses[PRIMARY_TIMEFRAME];
    const confirmation = analyses[CONFIRMATION_TIMEFRAME];

    const higher = HIGHER_TIMEFRAMES
      .map(timeframe => analyses[timeframe])
      .filter(item => item.status === "AVAILABLE");

    const entries = ENTRY_TIMEFRAMES
      .map(timeframe => analyses[timeframe])
      .filter(item => item.status === "AVAILABLE");

    const higherScore = higher.reduce(
      (sum, item) => sum + item.momentum,
      0
    );

    const entryScore = entries.reduce(
      (sum, item) => sum + item.momentum,
      0
    );

    const primaryScore = primary?.status === "AVAILABLE"
      ? primary.momentum
      : 0;

    const confirmationScore =
      confirmation?.status === "AVAILABLE"
        ? confirmation.momentum
        : 0;

    const alignment =
      primaryScore +
      confirmationScore +
      Math.sign(higherScore) +
      Math.sign(entryScore);

    let decision = "WAIT";

    if (primaryScore > 0 && confirmationScore >= 0) {
      decision = "BUY";
    } else if (primaryScore < 0 && confirmationScore <= 0) {
      decision = "SELL";
    }

    const confidenceBase =
      50 +
      Math.min(30, Math.abs(alignment) * 8);

    const coverageFactor =
      TIMEFRAME_ORDER.length > 0
        ? available.length / TIMEFRAME_ORDER.length
        : 0;

    const confidence = Math.round(
      Math.min(95, confidenceBase * (0.65 + coverageFactor * 0.35))
    );

    return {
      status: primary?.status === "AVAILABLE"
        ? "AVAILABLE"
        : "INSUFFICIENT_PRIMARY_DATA",
      timeframes: [...TIMEFRAME_ORDER],
      availableTimeframes: available,
      primaryTimeframe: PRIMARY_TIMEFRAME,
      confirmationTimeframe: CONFIRMATION_TIMEFRAME,
      decision,
      confidence,
      alignment,
      higherTimeframeScore: higherScore,
      primaryScore,
      confirmationScore,
      entryScore,
      analyses
    };
  }
};

export default Object.freeze(AfriForexMultiTimeframeEngine);
