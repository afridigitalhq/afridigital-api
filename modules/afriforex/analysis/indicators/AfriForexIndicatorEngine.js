const toNumber = value => Number.isFinite(Number(value)) ? Number(value) : null;

const closes = candles => candles.map(c => toNumber(c.close)).filter(Number.isFinite);
const highs = candles => candles.map(c => toNumber(c.high)).filter(Number.isFinite);
const lows = candles => candles.map(c => toNumber(c.low)).filter(Number.isFinite);

function sma(values, period) {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function emaSeries(values, period) {
  if (values.length < period) return [];
  const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const multiplier = 2 / (period + 1);
  const result = [seed];
  for (let i = period; i < values.length; i++) {
    result.push((values[i] - result[result.length - 1]) * multiplier + result[result.length - 1]);
  }
  return result;
}

function ema(values, period) {
  const series = emaSeries(values, period);
  return series.length ? series[series.length - 1] : null;
}

function rsi(values, period = 14) {
  if (values.length <= period) return null;
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = values[i] - values[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  return 100 - (100 / (1 + avgGain / avgLoss));
}

function trueRanges(candles) {
  const result = [];
  for (let i = 0; i < candles.length; i++) {
    const high = toNumber(candles[i].high);
    const low = toNumber(candles[i].low);
    const previousClose = i > 0 ? toNumber(candles[i - 1].close) : null;
    if (![high, low].every(Number.isFinite)) continue;

    result.push(
      i === 0 || !Number.isFinite(previousClose)
        ? high - low
        : Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose))
    );
  }
  return result;
}

function atr(candles, period = 14) {
  const trs = trueRanges(candles);
  if (trs.length < period) return null;
  return sma(trs, period);
}

function macd(values, fast = 12, slow = 26, signal = 9) {
  const fastSeries = emaSeries(values, fast);
  const slowSeries = emaSeries(values, slow);
  if (!fastSeries.length || !slowSeries.length) return null;

  const offset = fastSeries.length - slowSeries.length;
  const macdSeries = slowSeries.map((slowValue, index) =>
    fastSeries[index + offset] - slowValue
  );

  if (macdSeries.length < signal) return null;

  const signalSeries = emaSeries(macdSeries, signal);
  const macdValue = macdSeries[macdSeries.length - 1];
  const signalValue = signalSeries.length ? signalSeries[signalSeries.length - 1] : null;

  return {
    value: macdValue,
    signal: signalValue,
    histogram: signalValue === null ? null : macdValue - signalValue
  };
}

function bollinger(values, period = 20, multiplier = 2) {
  if (values.length < period) return null;

  const middle = sma(values, period);
  const slice = values.slice(-period);
  const variance = slice.reduce((sum, value) => sum + ((value - middle) ** 2), 0) / period;
  const standardDeviation = Math.sqrt(variance);

  return {
    middle,
    upper: middle + multiplier * standardDeviation,
    lower: middle - multiplier * standardDeviation,
    bandwidth: middle === 0 ? null : ((2 * multiplier * standardDeviation) / middle) * 100
  };
}

function adx(candles, period = 14) {
  if (candles.length < period * 2) return null;

  const tr = [];
  const plusDm = [];
  const minusDm = [];

  for (let i = 1; i < candles.length; i++) {
    const high = toNumber(candles[i].high);
    const low = toNumber(candles[i].low);
    const prevHigh = toNumber(candles[i - 1].high);
    const prevLow = toNumber(candles[i - 1].low);
    const prevClose = toNumber(candles[i - 1].close);

    if (![high, low, prevHigh, prevLow, prevClose].every(Number.isFinite)) continue;

    tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));

    const upMove = high - prevHigh;
    const downMove = prevLow - low;

    plusDm.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDm.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  if (tr.length < period) return null;

  const dx = [];

  for (let i = period - 1; i < tr.length; i++) {
    const trSlice = tr.slice(i - period + 1, i + 1);
    const plusSlice = plusDm.slice(i - period + 1, i + 1);
    const minusSlice = minusDm.slice(i - period + 1, i + 1);

    const trAvg = trSlice.reduce((a, b) => a + b, 0) / period;
    if (trAvg === 0) continue;

    const plusDi = 100 * (plusSlice.reduce((a, b) => a + b, 0) / period) / trAvg;
    const minusDi = 100 * (minusSlice.reduce((a, b) => a + b, 0) / period) / trAvg;
    const denominator = plusDi + minusDi;

    dx.push(denominator === 0 ? 0 : (100 * Math.abs(plusDi - minusDi)) / denominator);
  }

  if (dx.length < period) return null;

  return sma(dx, period);
}

function analyze(input = {}) {
  const candles = Array.isArray(input.candles)
    ? input.candles.filter(c => c && Number.isFinite(toNumber(c.close))).sort((a, b) => {
        const ta = Date.parse(a.timestamp ?? a.datetime ?? 0);
        const tb = Date.parse(b.timestamp ?? b.datetime ?? 0);
        return (Number.isFinite(ta) ? ta : 0) - (Number.isFinite(tb) ? tb : 0);
      })
    : [];

  if (!candles.length) {
    return {
      status: "INSUFFICIENT_DATA",
      symbol: input.symbol || null,
      timeframe: input.timeframe || null,
      indicators: {},
      availableIndicators: [],
      reason: "NO_VALID_CANDLES"
    };
  }

  const values = closes(candles);
  const indicatorValues = {
    ema20: ema(values, 20),
    ema50: ema(values, 50),
    ema200: ema(values, 200),
    rsi14: rsi(values, 14),
    macd: macd(values),
    atr14: atr(candles, 14),
    adx14: adx(candles, 14),
    bollinger20: bollinger(values, 20, 2)
  };

  const availableIndicators = Object.entries(indicatorValues)
    .filter(([, value]) => value !== null)
    .map(([name]) => name);

  return {
    status: availableIndicators.length ? "AVAILABLE" : "INSUFFICIENT_DATA",
    symbol: input.symbol || null,
    timeframe: input.timeframe || null,
    candleCount: candles.length,
    indicators: indicatorValues,
    availableIndicators,
    reason: availableIndicators.length
      ? "LOCAL_TECHNICAL_INDICATORS_CALCULATED"
      : "INSUFFICIENT_CANDLE_HISTORY"
  };
}

const AfriForexIndicatorEngine = Object.freeze({ analyze });

export default AfriForexIndicatorEngine;
