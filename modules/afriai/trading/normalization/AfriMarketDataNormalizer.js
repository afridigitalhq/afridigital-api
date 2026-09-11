import AfriMarketEvidence from "../evidence/AfriMarketEvidence.js";

const AfriMarketDataNormalizer = {
  toFiniteNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  },

  positiveNumber(value) {
    const number = this.toFiniteNumber(value);
    return number !== null && number > 0 ? number : null;
  },

  quote(payload, input = {}) {
    const price = this.positiveNumber(payload?.c);
    const timestamp = this.toFiniteNumber(payload?.t);

    return AfriMarketEvidence.create({
      source: input.source || "finnhub",
      type: "quote",
      symbol: input.symbol || null,
      data: {
        price,
        change: this.toFiniteNumber(payload?.d),
        changePercent: this.toFiniteNumber(payload?.dp),
        high: this.positiveNumber(payload?.h),
        low: this.positiveNumber(payload?.l),
        open: this.positiveNumber(payload?.o),
        previousClose: this.positiveNumber(payload?.pc),
        timestamp
      },
      observedAt: new Date().toISOString(),
      freshness: "REALTIME",
      status: price !== null ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  },

  forexCandles(payload, input = {}) {
    return AfriMarketEvidence.create({
      source: input.source || "finnhub",
      type: "forex_candles",
      symbol: input.symbol || null,
      data: {
        status: payload?.s || "unknown",
        timestamps: payload?.t || [],
        open: payload?.o || [],
        high: payload?.h || [],
        low: payload?.l || [],
        close: payload?.c || [],
        volume: payload?.v || []
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      status: payload?.s === "ok" ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  },

  finnhubCandles(payload, input = {}) {
    const timestamps = Array.isArray(payload?.t) ? payload.t : [];
    const opens = Array.isArray(payload?.o) ? payload.o : [];
    const highs = Array.isArray(payload?.h) ? payload.h : [];
    const lows = Array.isArray(payload?.l) ? payload.l : [];
    const closes = Array.isArray(payload?.c) ? payload.c : [];
    const volumes = Array.isArray(payload?.v) ? payload.v : [];

    const candles = timestamps
      .map((timestamp, index) => ({
        timestamp: this.toFiniteNumber(timestamp),
        open: this.toFiniteNumber(opens[index]),
        high: this.toFiniteNumber(highs[index]),
        low: this.toFiniteNumber(lows[index]),
        close: this.toFiniteNumber(closes[index]),
        volume: this.toFiniteNumber(volumes[index])
      }))
      .filter(candle =>
        candle.timestamp !== null &&
        candle.open !== null &&
        candle.high !== null &&
        candle.low !== null &&
        candle.close !== null
      );

    return AfriMarketEvidence.create({
      source: input.source || "finnhub",
      type: "candles",
      symbol: input.symbol || null,
      data: {
        timeframe: input.timeframe || null,
        candles,
        count: candles.length
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      status: payload?.s === "ok" && candles.length ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  },

  twelveDataCandles(payload, input = {}) {
    const values = Array.isArray(payload?.values) ? payload.values : [];

    const candles = values
      .map(candle => ({
        timestamp: candle?.datetime || null,
        open: this.toFiniteNumber(candle?.open),
        high: this.toFiniteNumber(candle?.high),
        low: this.toFiniteNumber(candle?.low),
        close: this.toFiniteNumber(candle?.close),
        volume: this.toFiniteNumber(candle?.volume)
      }))
      .filter(candle =>
        candle.open !== null &&
        candle.high !== null &&
        candle.low !== null &&
        candle.close !== null
      );

    return AfriMarketEvidence.create({
      source: input.source || "twelveData",
      type: "candles",
      symbol: input.symbol || null,
      data: {
        timeframe: input.timeframe || null,
        candles,
        count: candles.length
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      status: candles.length ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  },
  simulationCandles(payload, input = {}) {
    const candles = Array.isArray(payload?.candles)
      ? payload.candles.map(candle => ({
          timestamp: candle?.timestamp || null,
          open: this.toFiniteNumber(candle?.open),
          high: this.toFiniteNumber(candle?.high),
          low: this.toFiniteNumber(candle?.low),
          close: this.toFiniteNumber(candle?.close),
          volume: this.toFiniteNumber(candle?.volume)
        })).filter(candle =>
          candle.open !== null &&
          candle.high !== null &&
          candle.low !== null &&
          candle.close !== null
        )
      : [];

    return AfriMarketEvidence.create({
      source: input.source || "simulation",
      type: "candles",
      symbol: input.symbol || null,
      data: {
        timeframe: input.timeframe || null,
        candles,
        count: candles.length
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      status: candles.length ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  },

  cryptoCandles(payload, input = {}) {
    return AfriMarketEvidence.create({
      source: input.source || "finnhub",
      type: "crypto_candles",
      symbol: input.symbol || null,
      data: {
        status: payload?.s || "unknown",
        timestamps: payload?.t || [],
        open: payload?.o || [],
        high: payload?.h || [],
        low: payload?.l || [],
        close: payload?.c || [],
        volume: payload?.v || []
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      status: payload?.s === "ok" ? "AVAILABLE" : "UNAVAILABLE",
      providerRequest: input.providerRequest || null
    });
  }
};

export default AfriMarketDataNormalizer;
