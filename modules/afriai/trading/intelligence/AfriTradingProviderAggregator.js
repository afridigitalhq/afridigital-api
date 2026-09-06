import AfriTradingProviderRegistry from "../providers/bootstrap.js";
import AfriMarketDataNormalizer from "../normalization/AfriMarketDataNormalizer.js";

const AfriTradingProviderAggregator = {
  async collect(request = {}) {
    const assetType =
      String(request.assetType || request.marketType || "forex").toLowerCase();

    const symbol = request.symbol || (
      assetType === "crypto"
        ? "BINANCE:BTCUSDT"
        : "OANDA:EUR_USD"
    );

    const providers = AfriTradingProviderRegistry.all();
    const results = [];

    for (const provider of providers) {
      const capability = provider.capabilities?.[assetType];

      if (!provider.isConfigured()) {
        results.push({
          provider: provider.name,
          status: "UNAVAILABLE",
          reason: "NOT_CONFIGURED"
        });
        continue;
      }

      if (!capability?.quote) {
        results.push({
          provider: provider.name,
          status: "UNSUPPORTED",
          reason: "QUOTE_NOT_SUPPORTED",
          assetType
        });
        continue;
      }

      try {
        let payload;
        let evidence;

        if (assetType === "forex" && typeof provider.forexQuote === "function") {
          payload = await provider.forexQuote(symbol);

          const quote = payload?.["Realtime Currency Exchange Rate"];

          evidence = AfriMarketDataNormalizer.quote(
            {
              c: quote?.["5. Exchange Rate"],
              d: null,
              dp: null,
              h: null,
              l: null,
              o: null,
              pc: null,
              t: Date.parse(quote?.["6. Last Refreshed"] || "") / 1000
            },
            {
              source: provider.name,
              assetType,
              symbol,
              providerRequest: {
                endpoint: "CURRENCY_EXCHANGE_RATE",
                assetType,
                symbol
              }
            }
          );

          evidence.data.bid = Number(quote?.["8. Bid Price"]) || null;
          evidence.data.ask = Number(quote?.["9. Ask Price"]) || null;
        } else if (typeof provider.quote === "function") {
          payload = await provider.quote(symbol);

          evidence = AfriMarketDataNormalizer.quote(payload, {
            source: provider.name,
            assetType,
            symbol,
            providerRequest: {
              endpoint: "quote",
              assetType,
              symbol
            }
          });
        } else {
          results.push({
            provider: provider.name,
            status: "UNSUPPORTED",
            reason: "NO_QUOTE_METHOD",
            assetType
          });
          continue;
        }

        results.push({
          provider: provider.name,
          status: evidence.status,
          evidence
        });
      } catch (error) {
        results.push({
          provider: provider.name,
          status: "ERROR",
          reason: "PROVIDER_REQUEST_FAILED",
          error: error.message
        });
      }
    }

    const usable = results.filter(
      result => result.status === "AVAILABLE" && result.evidence
    );

    return {
      status: usable.length ? "AVAILABLE" : "NO_USABLE_PROVIDER",
      assetType,
      symbol,
      providersChecked: results.length,
      usableProviders: usable.length,
      results
    };
  },

  async collectCandles(request = {}) {
    const assetType = String(
      request.assetType || request.marketType || "forex"
    ).toLowerCase();

    const symbol = request.symbol || (
      assetType === "crypto"
        ? "BINANCE:BTCUSDT"
        : "EUR/USD"
    );

    const timeframes = Array.isArray(request.timeframes) && request.timeframes.length
      ? request.timeframes
      : ["1min", "5min", "15M", "1H", "4H", "1D", "1W", "1MO", "1Y"];

    const outputsize = Number.isFinite(request.outputsize)
      ? request.outputsize
      : 100;

    const providers = AfriTradingProviderRegistry.all();
    const results = [];

    for (const provider of providers) {
      const capability = provider.capabilities?.[assetType];

      if (!provider.isConfigured()) {
        results.push({
          provider: provider.name,
          status: "UNAVAILABLE",
          reason: "NOT_CONFIGURED",
          timeframes: {}
        });
        continue;
      }

      if (!capability?.candles) {
        results.push({
          provider: provider.name,
          status: "UNSUPPORTED",
          reason: "CANDLES_NOT_SUPPORTED",
          assetType,
          timeframes: {}
        });
        continue;
      }

      const providerTimeframes = {};

      for (const timeframe of timeframes) {
        try {
          let payload;

          const candleMethod = {
            forex: "forexCandles",
            crypto: "cryptoCandles",
            commodity: "commodityCandles",
            stock: "stockCandles"
          }[assetType];

          if (
            candleMethod &&
            typeof provider[candleMethod] === "function"
          ) {
            payload = await provider[candleMethod](
              symbol,
              timeframe,
              outputsize
            );
          } else {
            providerTimeframes[timeframe] = {
              status: "UNSUPPORTED",
              reason: "NO_CANDLE_METHOD",
              assetType
            };
            continue;
          }

          const normalizer = typeof AfriMarketDataNormalizer.twelveDataCandles === "function"
            ? AfriMarketDataNormalizer.twelveDataCandles
            : null;

          const evidence = normalizer
            ? normalizer.call(AfriMarketDataNormalizer, payload, {
                source: provider.name,
                symbol,
                timeframe,
                providerRequest: {
                  endpoint: "time_series",
                  assetType,
                  symbol,
                  timeframe
                }
              })
            : null;

          providerTimeframes[timeframe] = {
            status: evidence?.status || "UNAVAILABLE",
            evidence,
            payload
          };
        } catch (error) {
          providerTimeframes[timeframe] = {
            status: "ERROR",
            reason: "PROVIDER_CANDLE_REQUEST_FAILED",
            error: error.message
          };
        }
      }

      const availableTimeframes = Object.values(providerTimeframes)
        .filter(item => item.status === "AVAILABLE")
        .length;

      results.push({
        provider: provider.name,
        status: availableTimeframes ? "AVAILABLE" : "NO_USABLE_CANDLES",
        assetType,
        symbol,
        timeframes: providerTimeframes,
        availableTimeframes
      });
    }

    return {
      status: results.some(
        result => result.status === "AVAILABLE"
      )
        ? "AVAILABLE"
        : "NO_USABLE_PROVIDER",
      assetType,
      symbol,
      timeframes,
      providersChecked: results.length,
      results
    };
  }
};

export default AfriTradingProviderAggregator;
