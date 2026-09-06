import AfriTradingProviderRegistry from "../providers/bootstrap.js";
import AfriMarketDataNormalizer from "../normalization/AfriMarketDataNormalizer.js";

const DEFAULT_SYMBOLS = {
  forex: "OANDA:EUR_USD",
  crypto: "BINANCE:BTCUSDT"
};

const AfriTradingIntelligence = {
  async analyze(request = {}) {
    const provider = AfriTradingProviderRegistry.get("finnhub");

    if (!provider) {
      return {
        status: "UNAVAILABLE",
        reason: "NO_TRADING_PROVIDER"
      };
    }

    if (!provider.isConfigured()) {
      return {
        status: "UNAVAILABLE",
        reason: "FINNHUB_NOT_CONFIGURED",
        provider: provider.name
      };
    }

    const message =
      String(request.message || "").toLowerCase();

    const requestedAssetType =
      String(request.assetType || request.marketType || "").toLowerCase();

    const inferredAssetType =
      requestedAssetType ||
      (
        /\b(btc|bitcoin|eth|ethereum|crypto|cryptocurrency)\b/.test(message)
          ? "crypto"
          : "forex"
      );

    const assetType =
      inferredAssetType;

    const symbol =
      request.symbol ||
      DEFAULT_SYMBOLS[assetType] ||
      DEFAULT_SYMBOLS.forex;

    const providerRequest = {
      endpoint: "quote",
      assetType,
      symbol
    };

    const capability = provider.capabilities?.[assetType];

    if (!capability?.quote) {
      return {
        status: "UNSUPPORTED",
        reason: "PROVIDER_CAPABILITY_UNAVAILABLE",
        provider: provider.name,
        assetType,
        symbol,
        capability: {
          quote: Boolean(capability?.quote),
          symbols: Boolean(capability?.symbols),
          candles: Boolean(capability?.candles)
        }
      };
    }

    try {
      const payload = await provider.quote(symbol);

      const evidence = AfriMarketDataNormalizer.quote(payload, {
        source: provider.name,
        assetType,
        symbol,
        providerRequest
      });

      return {
        status: evidence.status,
        provider: provider.name,
        assetType,
        symbol,
        evidence
      };
    } catch (error) {
      return {
        status: "UNAVAILABLE",
        reason: "PROVIDER_REQUEST_FAILED",
        provider: provider.name,
        assetType,
        symbol,
        error: error.message
      };
    }
  }
};

export default AfriTradingIntelligence;
