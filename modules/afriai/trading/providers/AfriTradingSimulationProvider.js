const TIMEFRAME_CONFIG = Object.freeze({
  "1min": { stepMs: 60_000, drift: 0.00012 },
  "5min": { stepMs: 300_000, drift: 0.00028 },
  "15M": { stepMs: 900_000, drift: 0.00042 },
  "30M": { stepMs: 1_800_000, drift: 0.00055 },
  "1H": { stepMs: 3_600_000, drift: -0.00018 },
  "4H": { stepMs: 14_400_000, drift: -0.00055 },
  "1D": { stepMs: 86_400_000, drift: -0.00035 },
  "1W": { stepMs: 604_800_000, drift: 0.0012 },
  "1MO": { stepMs: 2_592_000_000, drift: 0.0025 }
});

const SUPPORTED_SYMBOLS = Object.freeze(["BTC/USD", "BTC/USDT"]);

function normalizeSymbol(symbol) {
  return String(symbol || "").trim().toUpperCase();
}

function generateCandles(timeframe, outputsize = 100) {
  const config = TIMEFRAME_CONFIG[timeframe];

  if (!config) {
    return [];
  }

  const count = Math.max(1, Math.min(Number(outputsize) || 100, 200));
  const candles = [];

  let price = 78_500;

  for (let index = count - 1; index >= 0; index -= 1) {
    const wave =
      Math.sin(index / 7) * 0.00065 +
      Math.cos(index / 13) * 0.00035;

    const returnRate = config.drift + wave;

    const open = price;
    const close = open * (1 + returnRate);

    const volatility =
      Math.abs(returnRate) * 0.65 + 0.00035;

    const high = Math.max(
      open,
      close
    ) * (1 + volatility);

    const low = Math.min(
      open,
      close
    ) * (1 - volatility);

    const volume =
      850 + Math.abs(Math.sin(index / 5)) * 650;

    candles.push({
      timestamp: new Date(
        Date.now() - index * config.stepMs
      ).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(2))
    });

    price = close;
  }

  return candles;
}

const AfriTradingSimulationProvider = Object.freeze({
  name: "simulation",

  capabilities: Object.freeze({
    forex: Object.freeze({
      symbols: false,
      quote: false,
      candles: false
    }),

    crypto: Object.freeze({
      symbols: false,
      quote: true,
      candles: true
    }),

    commodity: Object.freeze({
      symbols: false,
      quote: false,
      candles: false
    }),

    stock: Object.freeze({
      symbols: false,
      quote: false,
      candles: false
    })
  }),

  isConfigured() {
    return true;
  },

  normalizeSymbol(symbol) {
    return normalizeSymbol(symbol);
  },

  async getQuote(symbol) {
    const normalized = normalizeSymbol(symbol);

    if (!SUPPORTED_SYMBOLS.includes(normalized)) {
      return {
        status: "UNAVAILABLE",
        reason: "SIMULATION_SYMBOL_UNSUPPORTED",
        symbol: normalized
      };
    }

    const candles = generateCandles("1min", 2);
    const price = candles.at(-1)?.close ?? null;

    return {
      status: "AVAILABLE",
      symbol: normalized,
      price,
      dataMode: "SIMULATED",
      provider: this.name
    };
  },

  async cryptoCandles(symbol, timeframe, outputsize = 100) {
    return this.getCandles(symbol, timeframe, outputsize);
  },

  normalizeCandles(payload = {}, context = {}) {
    const candles = Array.isArray(payload.candles)
      ? payload.candles
      : [];

    return {
      status: candles.length ? "AVAILABLE" : "UNAVAILABLE",
      source: this.name,
      dataMode: "SIMULATED",
      data: {
        candles
      },
      meta: {
        ...context,
        provider: this.name,
        dataMode: "SIMULATED"
      }
    };
  },

  async getCandles(symbol, timeframe, outputsize = 100) {
    const normalized = normalizeSymbol(symbol);

    if (!SUPPORTED_SYMBOLS.includes(normalized)) {
      return {
        status: "UNAVAILABLE",
        reason: "SIMULATION_SYMBOL_UNSUPPORTED",
        symbol: normalized,
        timeframe
      };
    }

    if (!TIMEFRAME_CONFIG[timeframe]) {
      return {
        status: "UNAVAILABLE",
        reason: "SIMULATION_TIMEFRAME_UNSUPPORTED",
        symbol: normalized,
        timeframe
      };
    }

    const candles = generateCandles(timeframe, outputsize);

    return {
      status: candles.length ? "AVAILABLE" : "UNAVAILABLE",
      symbol: normalized,
      timeframe,
      candles,
      dataMode: "SIMULATED",
      provider: this.name
    };
  }
});

export default AfriTradingSimulationProvider;
