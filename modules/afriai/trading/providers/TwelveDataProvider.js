const TWELVEDATA_BASE = "https://api.twelvedata.com";

const TIMEFRAME_INTERVALS = {
  "1min": "1min",
  "5min": "5min",
  "15M": "15min",
  "1H": "1h",
  "4H": "4h",
  "1D": "1day",
  "1W": "1week",
  "1MO": "1month"
};

const TwelveDataProvider = {
  name: "twelveData",

  capabilities: {
    forex: {
      symbols: false,
      quote: false,
      candles: true
    },
    crypto: {
      symbols: false,
      quote: true,
      candles: true
    },
    commodity: {
      symbols: false,
      quote: true,
      candles: true
    },
    stock: {
      symbols: false,
      quote: false,
      candles: true
    }
  },

  isConfigured() {
    return Boolean(process.env.TWELVEDATA_API_KEY);
  },

  timeframeInterval(timeframe) {
    return TIMEFRAME_INTERVALS[String(timeframe || "").trim()] || null;
  },

  normalizeSymbol(symbol) {
    const normalized = String(symbol || "").trim().toUpperCase();

    if (normalized.startsWith("BINANCE:")) {
      const binanceSymbol = normalized.slice("BINANCE:".length);

      if (binanceSymbol.endsWith("USDT") && binanceSymbol.length > 4) {
        return `${binanceSymbol.slice(0, -4)}/USD`;
      }

      return binanceSymbol;
    }

    if (normalized.endsWith("/USDT")) {
      return `${normalized.slice(0, -5)}/USD`;
    }

    if (
      normalized.endsWith("USDT") &&
      normalized.length > 4 &&
      !normalized.includes("/")
    ) {
      return `${normalized.slice(0, -4)}/USD`;
    }

    return normalized;
  },

  async timeSeries(symbol, timeframe = "4H", outputsize = 100) {
    const interval = this.timeframeInterval(timeframe);

    if (!interval) {
      throw new Error(`TWELVEDATA_UNSUPPORTED_TIMEFRAME:${timeframe}`);
    }

    if (!this.isConfigured()) {
      throw new Error("TWELVEDATA_API_KEY_NOT_CONFIGURED");
    }

    const providerSymbol = this.normalizeSymbol(symbol);

    const parameters = new URLSearchParams({
      symbol: providerSymbol,
      interval,
      outputsize: String(outputsize),
      format: "JSON",
      apikey: process.env.TWELVEDATA_API_KEY
    });

    const response = await fetch(
      `${TWELVEDATA_BASE}/time_series?${parameters.toString()}`
    );

    const payload = await response.json();

    if (!response.ok || payload?.status === "error") {
      throw new Error(
        payload?.message ||
        payload?.code ||
        "TWELVEDATA_REQUEST_FAILED"
      );
    }

    return payload;
  },

  async quote(symbol) {
    if (!this.isConfigured()) {
      throw new Error("TWELVEDATA_API_KEY_NOT_CONFIGURED");
    }

    const providerSymbol = this.normalizeSymbol(symbol);

    const parameters = new URLSearchParams({
      symbol: providerSymbol,
      apikey: process.env.TWELVEDATA_API_KEY
    });

    const response = await fetch(
      `${TWELVEDATA_BASE}/price?${parameters.toString()}`
    );

    const payload = await response.json();

    if (!response.ok || payload?.status === "error" || !payload?.price) {
      throw new Error(
        payload?.message ||
        payload?.code ||
        "TWELVEDATA_QUOTE_REQUEST_FAILED"
      );
    }

    return {
      c: Number(payload.price),
      t: Math.floor(Date.now() / 1000)
    };
  },

  async forexCandles(symbol, timeframe = "4H", outputsize = 100) {
    return this.timeSeries(symbol, timeframe, outputsize);
  },

  async cryptoCandles(symbol, timeframe = "4H", outputsize = 100) {
    return this.timeSeries(symbol, timeframe, outputsize);
  },

  async commodityCandles(symbol, timeframe = "4H", outputsize = 100) {
    return this.timeSeries(symbol, timeframe, outputsize);
  },

  async stockCandles(symbol, timeframe = "4H", outputsize = 100) {
    return this.timeSeries(symbol, timeframe, outputsize);
  }
};

export default Object.freeze(TwelveDataProvider);
