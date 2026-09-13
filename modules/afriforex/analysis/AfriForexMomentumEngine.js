function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function calculateMomentum(candles = []) {
  if (!Array.isArray(candles) || candles.length < 3) {
    return {
      status: "INSUFFICIENT_DATA",
      direction: "NEUTRAL",
      strength: 0,
      strengthPercent: 0,
      classification: "NEUTRAL",
      changePercent: 0,
      acceleration: 0,
      accelerationPercent: 0,
      volumeConfirmation: "UNAVAILABLE",
      reason: "MOMENTUM_REQUIRES_AT_LEAST_THREE_CANDLES"
    };
  }

  const usable = [...candles]
    .filter(candle =>
      candle &&
      finite(candle?.close ?? candle?.price) !== null &&
      finite(candle?.close ?? candle?.price) > 0
    )
    .sort((a, b) => {
      const ta = Date.parse(a?.timestamp ?? a?.datetime ?? 0);
      const tb = Date.parse(b?.timestamp ?? b?.datetime ?? 0);
      return (Number.isFinite(ta) ? ta : 0) - (Number.isFinite(tb) ? tb : 0);
    })
    .map(candle => ({
      open: finite(candle?.open),
      high: finite(candle?.high),
      low: finite(candle?.low),
      close: finite(candle?.close ?? candle?.price),
      volume: finite(candle?.volume)
    }));

  if (usable.length < 3) {
    return {
      status: "INSUFFICIENT_DATA",
      direction: "NEUTRAL",
      strength: 0,
      strengthPercent: 0,
      classification: "NEUTRAL",
      changePercent: 0,
      acceleration: 0,
      accelerationPercent: 0,
      volumeConfirmation: "UNAVAILABLE",
      reason: "NO_VALID_CANDLE_SEQUENCE"
    };
  }

  const first = usable[0].close;
  const latest = usable[usable.length - 1].close;
  const previous = usable[usable.length - 2].close;

  const midpointIndex = Math.max(
    1,
    Math.floor((usable.length - 1) / 2)
  );

  const midpoint = usable[midpointIndex].close;

  const changePercent =
    ((latest - first) / first) * 100;

  const firstHalfPercent =
    ((midpoint - first) / first) * 100;

  const secondHalfPercent =
    ((latest - midpoint) / midpoint) * 100;

  const acceleration =
    secondHalfPercent - firstHalfPercent;

  /*
   * Directional momentum strength is intentionally based on
   * the magnitude of the observed price move.
   *
   * 0% movement = 0 strength.
   * Larger directional movement = larger strength.
   *
   * The scale is continuous from 0 to 100 and is NOT a
   * probability of profit.
   */
  const absChange = Math.abs(changePercent);

  /*
   * A 2% observed move represents very strong momentum.
   * The square-root curve gives useful resolution at the
   * lower end so values such as 1, 2, 3, 5, 10 and 13
   * remain naturally possible.
   */
  const strengthPercent = Math.round(
    clamp(
      Math.sqrt(absChange / 2) * 100,
      0,
      100
    )
  );

  const strength =
    changePercent > 0
      ? strengthPercent
      : changePercent < 0
        ? -strengthPercent
        : 0;

  const direction =
    strength > 0
      ? "BUY"
      : strength < 0
        ? "SELL"
        : "NEUTRAL";

  const classification =
    strengthPercent >= 75
      ? "STRONG"
      : strengthPercent >= 50
        ? "MODERATE"
        : strengthPercent >= 25
          ? "DEVELOPING"
          : strengthPercent > 0
            ? "WEAK"
            : "NEUTRAL";

  const accelerationPercent = Math.round(
    clamp(
      Math.abs(acceleration) /
        Math.max(absChange, 0.000001) *
        100,
      0,
      100
    )
  );

  const volumes = usable
    .map(candle => candle.volume)
    .filter(Number.isFinite);

  let volumeConfirmation = "UNAVAILABLE";

  if (volumes.length >= 3) {
    const latestVolume = volumes[volumes.length - 1];

    const averageVolume =
      volumes.reduce((sum, value) => sum + value, 0) /
      volumes.length;

    if (averageVolume > 0) {
      if (
        direction === "BUY" &&
        latestVolume > averageVolume
      ) {
        volumeConfirmation = "BULLISH";
      } else if (
        direction === "SELL" &&
        latestVolume > averageVolume
      ) {
        volumeConfirmation = "BEARISH";
      } else {
        volumeConfirmation = "NEUTRAL";
      }
    }
  }

  return {
    status: "AVAILABLE",
    direction,
    strength,
    strengthPercent,
    classification,
    changePercent: Number(changePercent.toFixed(4)),
    acceleration: Number(acceleration.toFixed(4)),
    accelerationPercent,
    volumeConfirmation,
    reason:
      direction === "BUY"
        ? "POSITIVE_PRICE_MOMENTUM"
        : direction === "SELL"
          ? "NEGATIVE_PRICE_MOMENTUM"
          : "NEUTRAL_PRICE_MOMENTUM"
  };
}

const AfriForexMomentumEngine = {
  analyze(input = {}) {
    return {
      symbol: input.symbol || null,
      timeframe: input.timeframe || null,
      ...calculateMomentum(input.candles)
    };
  }
};

export { calculateMomentum };

export default Object.freeze(AfriForexMomentumEngine);
