const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const FinnhubProvider = {
  name: "finnhub",

  capabilities: {
    forex: {
      symbols: true,
      quote: false,
      candles: false
    },
    crypto: {
      symbols: true,
      quote: true,
      candles: false
    }
  },

  isConfigured() {
    return Boolean(process.env.FINNHUB_API_KEY);
  },

  async request(path, params = {}) {
    if (!this.isConfigured()) {
      throw new Error("FINNHUB_API_KEY is not configured");
    }

    const url = new URL(`${FINNHUB_BASE_URL}${path}`);

    Object.entries({
      ...params,
      token: process.env.FINNHUB_API_KEY
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub request failed: HTTP_${response.status}`);
    }

    return response.json();
  },

  async forexSymbols(exchange = "oanda") {
    return this.request("/forex/symbol", { exchange });
  },

  async forexCandles(symbol, resolution = "1", from, to) {
    return this.request("/forex/candle", {
      symbol,
      resolution,
      from,
      to
    });
  },

  async cryptoSymbols(exchange = "binance") {
    return this.request("/crypto/symbol", { exchange });
  },

  async quote(symbol) {
    return this.request("/quote", { symbol });
  },

  async cryptoCandles(symbol, resolution = "1", from, to) {
    return this.request("/crypto/candle", {
      symbol,
      resolution,
      from,
      to
    });
  }
};

export default FinnhubProvider;
