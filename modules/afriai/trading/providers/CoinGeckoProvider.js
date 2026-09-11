const BASE = "https://api.coingecko.com/api/v3";

const COINS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  DOGE: "dogecoin",
  ADA: "cardano",
  BNB: "binancecoin",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  DOT: "polkadot",
  MATIC: "matic-network",
  LTC: "litecoin"
};

const TIMEFRAME_MINUTES = {
  "15M": 15,
  "1H": 60,
  "4H": 240,
  "1D": 1440
};

function coinId(symbol) {
  const normalized = String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/^BINANCE:/, "");

  const base = normalized.replace(/\/USDT$|\/USD$|USDT$|USD$/i, "");

  return COINS[base] || null;
}

function headers() {
  return process.env.COINGECKO_API_KEY
    ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
    : {};
}

async function get(path, params = {}) {
  const url = new URL(BASE + path);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, { headers: headers() });
  const payload = await response.json();

  if (!response.ok || payload?.error || payload?.status?.error_message) {
    throw new Error(
      payload?.error ||
      payload?.status?.error_message ||
      `COINGECKO_HTTP_${response.status}`
    );
  }

  return payload;
}

function aggregatePrices(points, minutes) {
  const bucketSize = minutes * 60 * 1000;
  const buckets = new Map();

  for (const point of points || []) {
    const timestamp = Number(point?.[0]);
    const price = Number(point?.[1]);

    if (!Number.isFinite(timestamp) || !Number.isFinite(price)) continue;

    const bucket = Math.floor(timestamp / bucketSize) * bucketSize;

    if (!buckets.has(bucket)) buckets.set(bucket, []);

    buckets.get(bucket).push(price);
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, values]) => ({
      timestamp: new Date(timestamp).toISOString(),
      open: values[0],
      high: Math.max(...values),
      low: Math.min(...values),
      close: values[values.length - 1],
      volume: null
    }))
    .filter(candle =>
      [candle.open, candle.high, candle.low, candle.close]
        .every(Number.isFinite)
    );
}

const CoinGeckoProvider = {
  name: "coinGecko",

  capabilities: {
    forex: { symbols: false, quote: false, candles: false },
    crypto: { symbols: false, quote: true, candles: true },
    commodity: { symbols: false, quote: false, candles: false },
    stock: { symbols: false, quote: false, candles: false }
  },

  isConfigured() {
    return Boolean(process.env.COINGECKO_API_KEY);
  },

  normalizeSymbol(symbol) {
    return String(symbol || "")
      .trim()
      .toUpperCase()
      .replace(/^BINANCE:/, "");
  },

  async quote(symbol) {
    const id = coinId(symbol);

    if (!id) {
      throw new Error(`COINGECKO_UNSUPPORTED_SYMBOL:${symbol}`);
    }

    const payload = await get("/simple/price", {
      ids: id,
      vs_currencies: "usd",
      include_last_updated_at: "true"
    });

    const price = Number(payload?.[id]?.usd);

    if (!Number.isFinite(price)) {
      throw new Error("COINGECKO_QUOTE_UNAVAILABLE");
    }

    return {
      c: price,
      t:
        Number(payload?.[id]?.last_updated_at) ||
        Math.floor(Date.now() / 1000)
    };
  },

  async cryptoCandles(symbol, timeframe = "1H", outputsize = 100) {
    const id = coinId(symbol);

    if (!id) {
      throw new Error(`COINGECKO_UNSUPPORTED_SYMBOL:${symbol}`);
    }

    const minutes =
      TIMEFRAME_MINUTES[String(timeframe).trim().toUpperCase()];

    if (!minutes) {
      throw new Error(
        `COINGECKO_UNSUPPORTED_TIMEFRAME:${timeframe}`
      );
    }

    const days =
      minutes === 15
        ? 1
        : minutes === 60
          ? 7
          : minutes === 240
            ? 30
            : 365;

    const payload = await get(`/coins/${id}/market_chart`, {
      vs_currency: "usd",
      days
    });

    const candles = aggregatePrices(
      Array.isArray(payload?.prices) ? payload.prices : [],
      minutes
    );

    return {
      values: candles.slice(-Number(outputsize || 100))
    };
  },

  normalizeCandles(payload, input = {}) {
    const values = Array.isArray(payload?.values)
      ? payload.values
      : [];

    const candles = values.filter(candle =>
      [candle?.open, candle?.high, candle?.low, candle?.close]
        .every(value => Number.isFinite(Number(value)))
    );

    return {
      status: candles.length ? "AVAILABLE" : "UNAVAILABLE",
      source: this.name,
      type: "candles",
      symbol: input.symbol || null,
      data: {
        timeframe: input.timeframe || null,
        candles,
        count: candles.length
      },
      observedAt: new Date().toISOString(),
      freshness: "HISTORICAL",
      providerRequest: input.providerRequest || null
    };
  }
};

export default Object.freeze(CoinGeckoProvider);
