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
      if (provider.name === "simulation") continue;
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
        } else if (typeof provider.getQuote === "function") {
          payload = await provider.getQuote(symbol);

          const normalizedPayload = payload?.price != null
            ? {
                c: payload.price,
                d: payload.change ?? null,
                dp: payload.changePercent ?? null,
                h: payload.high ?? null,
                l: payload.low ?? null,
                o: payload.open ?? null,
                pc: payload.previousClose ?? null,
                t: payload.timestamp ? Date.parse(payload.timestamp) / 1000 : Date.now() / 1000,
                status: payload.status,
                symbol: payload.symbol,
                dataMode: payload.dataMode
              }
            : payload;
          evidence = AfriMarketDataNormalizer.quote(normalizedPayload, {
            source: provider.name,
            assetType,
            symbol,
            providerRequest: {
              endpoint: "getQuote",
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

    const symbol =
      request.symbol ||
      (assetType === "crypto" ? "BTC/USDT" : "EUR/USD");

    const timeframes =
      Array.isArray(request.timeframes) && request.timeframes.length
        ? request.timeframes
        : ["15M", "1H", "4H", "1D"];

    const outputsize = Number.isFinite(request.outputsize)
      ? request.outputsize
      : 100;

    const providers = AfriTradingProviderRegistry.all();
    const results = [];

    for (const provider of providers) {
      if (provider.name === "simulation") continue;
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
      let providerFailed = false;

      for (const timeframe of timeframes) {
        try {
          const candleMethod = {
            forex: "forexCandles",
            crypto: "cryptoCandles",
            commodity: "commodityCandles",
            stock: "stockCandles"
          }[assetType];

          if (
            !candleMethod ||
            typeof provider[candleMethod] !== "function" && typeof provider.getCandles !== "function"
          ) {
            providerTimeframes[timeframe] = {
              status: "UNSUPPORTED",
              reason: "NO_CANDLE_METHOD",
              assetType
            };
            continue;
          }

          const payload = await (typeof provider[candleMethod] === "function" ? provider[candleMethod] : provider.getCandles).call(provider,
            symbol,
            timeframe,
            outputsize
          );

          let evidence;

          if (typeof provider.normalizeCandles === "function") {
            evidence = provider.normalizeCandles(payload, {
              source: provider.name,
              assetType,
              symbol,
              timeframe,
              providerRequest: {
                endpoint: "candles",
                assetType,
                symbol,
                timeframe
              }
            });
          } else if (
            provider.name === "simulation" &&
            typeof AfriMarketDataNormalizer.simulationCandles === "function"
          ) {
            evidence = AfriMarketDataNormalizer.simulationCandles(
              payload,
              {
                source: provider.name,
                symbol,
                timeframe,
                providerRequest: {
                  endpoint: "getCandles",
                  assetType,
                  symbol,
                  timeframe
                }
              }
            );
          } else if (
            provider.name === "finnhub" &&
            typeof AfriMarketDataNormalizer.finnhubCandles === "function"
          ) {
            evidence = AfriMarketDataNormalizer.finnhubCandles(
              payload,
              {
                source: provider.name,
                symbol,
                timeframe,
                providerRequest: {
                  endpoint: "candles",
                  assetType,
                  symbol,
                  timeframe
                }
              }
            );
          } else {
            evidence = AfriMarketDataNormalizer.twelveDataCandles(
              payload,
              {
                source: provider.name,
                symbol,
                timeframe,
                providerRequest: {
                  endpoint: "time_series",
                  assetType,
                  symbol,
                  timeframe
                }
              }
            );
          }

          providerTimeframes[timeframe] = {
            status: evidence?.status || "UNAVAILABLE",
            evidence
          };

          if (evidence?.status !== "AVAILABLE") {
            providerFailed = true;
            break;
          }
        } catch (error) {
          const errorMessage = String(error?.message || error || "UNKNOWN_ERROR");
          const quotaOrRateLimit = /quota|credit|rate.?limit|too many requests|429|daily limit/i.test(
            errorMessage
          );

          providerTimeframes[timeframe] = {
            status: "ERROR",
            reason: quotaOrRateLimit
              ? "PROVIDER_RATE_LIMIT_OR_QUOTA"
              : "PROVIDER_CANDLE_REQUEST_FAILED",
            error: errorMessage
          };

          if (quotaOrRateLimit) {
            providerFailed = true;

            for (const remainingTimeframe of timeframes) {
              if (!providerTimeframes[remainingTimeframe]) {
                providerTimeframes[remainingTimeframe] = {
                  status: "SKIPPED",
                  reason: "PROVIDER_RATE_LIMIT_OR_QUOTA"
                };
              }
            }

            break;
          }

          continue;
        }
      }

      const availableTimeframes = Object.values(
        providerTimeframes
      ).filter(item => item.status === "AVAILABLE").length;

      const complete =
        availableTimeframes === timeframes.length;

      const partial =
        availableTimeframes > 0;

      results.push({
        provider: provider.name,
        status: complete
          ? "AVAILABLE"
          : partial
            ? "PARTIAL"
            : "NO_USABLE_CANDLES",
        assetType,
        symbol,
        timeframes: providerTimeframes,
        availableTimeframes,
        selected: complete,
        partial
      });

      if (complete) {
        return {
          status: "AVAILABLE",
          assetType,
          symbol,
          timeframes,
          providersChecked: results.length,
          selectedProvider: provider.name,
          usableProviders: 1,
          results
        };
      }
    }

    const usableProviders = results.filter(
      result =>
        (result.status === "AVAILABLE" || result.status === "PARTIAL") &&
        Object.values(result.timeframes || {}).some(
          item =>
            item?.status === "AVAILABLE" &&
            item?.evidence?.data?.candles?.length
        )
    ).length;

    return {
      status: usableProviders > 0 ? "AVAILABLE" : "NO_USABLE_PROVIDER",
      assetType,
      symbol,
      timeframes,
      providersChecked: results.length,
      usableProviders,
      results
    };
  }
};

export default AfriTradingProviderAggregator;
