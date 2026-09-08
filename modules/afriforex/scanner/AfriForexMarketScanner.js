import AfriTradingProviderAggregator from "../../afriai/trading/intelligence/AfriTradingProviderAggregator.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";
import AfriForexMultiTimeframeEngine from "../analysis/AfriForexMultiTimeframeEngine.js";

const DEFAULT_MARKETS = [
  {
    assetType: "forex",
    symbol: "EUR/USD",
    displaySymbol: "EUR/USD"
  },
  {
    assetType: "forex",
    symbol: "GBP/USD",
    displaySymbol: "GBP/USD"
  },
  {
    assetType: "forex",
    symbol: "USD/JPY",
    displaySymbol: "USD/JPY"
  },
  {
    assetType: "forex",
    symbol: "AUD/USD",
    displaySymbol: "AUD/USD"
  },
  {
    assetType: "crypto",
    symbol: "BTC/USDT",
    displaySymbol: "BTC/USDT"
  },
  {
    assetType: "crypto",
    symbol: "ETH/USDT",
    displaySymbol: "ETH/USDT"
  },
  {
    assetType: "crypto",
    symbol: "SOL/USDT",
    displaySymbol: "SOL/USDT"
  },
  {
    assetType: "commodity",
    symbol: "XAU/USD",
    displaySymbol: "XAU/USD"
  },
  {
    assetType: "stock",
    symbol: "AAPL",
    displaySymbol: "AAPL"
  },
  {
    assetType: "crypto",
    symbol: "XRP/USDT",
    displaySymbol: "XRP/USDT"
  },

  {
    assetType: "stock",
    symbol: "MSFT",
    displaySymbol: "MSFT"
  },
  {
    assetType: "stock",
    symbol: "NVDA",
    displaySymbol: "NVDA"
  },
  {
    assetType: "stock",
    symbol: "AMZN",
    displaySymbol: "AMZN"
  }
];

function normalizeMarket(market) {
  if (typeof market === "string") {
    const symbol = market.trim().toUpperCase();

    const configured = DEFAULT_MARKETS.find(
      item =>
        item.symbol.toUpperCase() === symbol ||
        item.displaySymbol.toUpperCase() === symbol
    );

    if (configured) {
      return {
        assetType: configured.assetType,
        symbol: configured.symbol,
        displaySymbol: configured.displaySymbol
      };
    }

    let assetType = "stock";

    if (symbol.endsWith("/USDT") || symbol.endsWith("USDT")) {
      assetType = "crypto";
    } else if (symbol.includes("/")) {
      assetType = "forex";
    }

    return {
      assetType,
      symbol,
      displaySymbol: symbol
    };
  }

  return {
    assetType: market?.assetType || "crypto",
    symbol: market?.symbol || market?.displaySymbol || "",
    displaySymbol: market?.displaySymbol || market?.symbol || ""
  };
}

const AfriForexMarketScanner = {
  async scan(customerId = "guest", markets = null) {
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const configuredMarkets =
      Array.isArray(markets) && markets.length
        ? markets
        : preferences.allowedMarkets.length
          ? preferences.allowedMarkets
          : DEFAULT_MARKETS;

    const normalizedMarkets = configuredMarkets
      .map(normalizeMarket)
      .filter(market => market.symbol);

    const results = [];

    for (const market of normalizedMarkets) {
      const evidence = await AfriTradingProviderAggregator.collect({
        assetType: market.assetType,
        symbol: market.symbol
      });

      const usable = evidence.results
        .filter(result => result.status === "AVAILABLE" && result.evidence)
        .map(result => ({
          provider: result.provider,
          evidence: result.evidence
        }));

      const candleEvidence = await AfriTradingProviderAggregator.collectCandles({
        assetType: market.assetType,
        symbol: market.symbol,
        timeframes: [
          "15M",
          "1H",
          "4H",
          "1D"
        ],
        outputsize: 100
      });

      const mergedTimeframes = {};

      for (const providerResult of candleEvidence.results || []) {
        for (const [timeframe, item] of Object.entries(
          providerResult.timeframes || {}
        )) {
          if (
            item?.status === "AVAILABLE" &&
            item?.evidence?.data?.candles?.length &&
            !mergedTimeframes[timeframe]
          ) {
            mergedTimeframes[timeframe] = item.evidence;
          }
        }
      }

      const multiTimeframeAnalysis = AfriForexMultiTimeframeEngine.analyze({
        timeframes: mergedTimeframes
      });

      results.push({
        ...market,
        status: evidence.status,
        providersChecked: evidence.providersChecked,
        usableProviders: evidence.usableProviders,
        evidence: usable,
        candleEvidence,
        multiTimeframeAnalysis,
        preferred: preferences.preferredMarkets.some(
          preferred =>
            preferred === market.symbol ||
            preferred === market.displaySymbol
        )
      });
    }

    return {
      customerId,
      scannedAt: new Date().toISOString(),
      marketsScanned: results.length,
      opportunities: results.filter(
        market => market.status === "AVAILABLE"
      ),
      results
    };
  }
};

export default AfriForexMarketScanner;
