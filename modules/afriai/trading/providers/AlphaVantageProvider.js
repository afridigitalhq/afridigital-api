const ALPHAVANTAGE_BASE_URL = "https://www.alphavantage.co/query";

const AlphaVantageProvider = {
  name: "alpha_vantage",

  capabilities: {
    forex: {
      symbols: false,
      quote: true,
      candles: true
    },
    crypto: {
      symbols: false,
      quote: false,
      candles: false
    }
  },

  isConfigured() {
    return Boolean(process.env.ALPHAVANTAGE_API_KEY);
  },

  async request(params = {}) {
    if (!this.isConfigured()) {
      throw new Error("ALPHAVANTAGE_API_KEY is not configured");
    }

    const url = new URL(ALPHAVANTAGE_BASE_URL);

    Object.entries({
      ...params,
      apikey: process.env.ALPHAVANTAGE_API_KEY
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Alpha Vantage request failed: HTTP_${response.status}`
      );
    }

    const payload = await response.json();

    if (payload?.["Error Message"]) {
      throw new Error(payload["Error Message"]);
    }

    if (payload?.Note) {
      throw new Error(`ALPHA_VANTAGE_RATE_LIMIT: ${payload.Note}`);
    }

    if (payload?.Information) {
      throw new Error(`ALPHA_VANTAGE_INFORMATION: ${payload.Information}`);
    }

    return payload;
  },

  normalizeForexSymbol(symbol = "EUR/USD") {
    const match = String(symbol).trim().toUpperCase().match(/^([A-Z]{3})[\\/_]([A-Z]{3})$/);
    if (!match) {
      throw new Error(`INVALID_FOREX_SYMBOL: ${symbol}`);
    }
    return {
      fromCurrency: match[1],
      toCurrency: match[2]
    };
  },

  async forexQuote(symbol = "EUR/USD") {
    const { fromCurrency, toCurrency } = this.normalizeForexSymbol(symbol);


    return this.request({
      function: "CURRENCY_EXCHANGE_RATE",
      from_currency: fromCurrency,
      to_currency: toCurrency
    });
  },

  async forexDaily(symbol = "EUR/USD") {
    const { fromCurrency, toCurrency } = this.normalizeForexSymbol(symbol);


    return this.request({
      function: "FX_DAILY",
      from_symbol: fromCurrency,
      to_symbol: toCurrency
    });
  }
};

export default AlphaVantageProvider;
