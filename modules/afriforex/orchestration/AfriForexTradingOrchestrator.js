import AfriForexMarketScanner from "../scanner/AfriForexMarketScanner.js";
import AfriForexSignalEngine from "../signals/AfriForexSignalEngine.js";
import AfriForexRiskEngine from "../risk/AfriForexRiskEngine.js";
import AfriForexDemoExecutionEngine from "../execution/AfriForexDemoExecutionEngine.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";

function buildSignalMarket(market) {
  return {
    symbol: market.displaySymbol || market.symbol,
    assetType: market.assetType,
    evidence: market.evidence || [],
    multiTimeframeAnalysis: market.multiTimeframeAnalysis || null
  };
}

const AfriForexTradingOrchestrator = {
  async scan(customerId = "guest", markets = null) {
    const scan = await AfriForexMarketScanner.scan(customerId, markets);
    const account = AfriForexDemoStore.getAccount(customerId);
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const results = scan.results.map((market) => {
      const signal = AfriForexSignalEngine.evaluate(
        buildSignalMarket(market)
      );

      const risk = signal.tradeable
        ? AfriForexRiskEngine.calculate({
            signal,
            account,
            preferences
          })
        : {
            status: "REJECTED",
            reason: "SIGNAL_NOT_TRADEABLE"
          };

      return {
        ...market,
        signal,
        risk
      };
    });

    return {
      status: "COMPLETED",
      customerId,
      scannedAt: scan.scannedAt,
      marketsScanned: scan.marketsScanned,
      opportunities: results.filter(
        (market) => market.signal.tradeable
      ),
      results
    };
  },

  async trade({
    customerId = "guest",
    market = {},
    lotSize,
    leverage,
    stopLoss,
    takeProfit
  } = {}) {
    const account = AfriForexDemoStore.getAccount(customerId);
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const evidenceResult = await AfriForexMarketScanner.scan(
      customerId,
      [market]
    );

    const scannedMarket = evidenceResult.results[0];

    if (!scannedMarket) {
      return {
        status: "REJECTED",
        reason: "MARKET_NOT_FOUND"
      };
    }

    const signal = AfriForexSignalEngine.evaluate(
      buildSignalMarket(scannedMarket)
    );

    if (!signal.tradeable) {
      return {
        status: "REJECTED",
        reason: "SIGNAL_NOT_TRADEABLE",
        market: scannedMarket,
        signal
      };
    }

    const risk = AfriForexRiskEngine.calculate({
      signal,
      account,
      preferences,
      lotSize,
      leverage,
      stopLoss,
      takeProfit
    });

    if (risk.status !== "APPROVED") {
      return {
        status: "REJECTED",
        reason: "RISK_NOT_APPROVED",
        market: scannedMarket,
        signal,
        risk
      };
    }

    const execution = AfriForexDemoExecutionEngine.open({
      customerId,
      market: scannedMarket,
      signal,
      risk
    });

    return {
      status: execution.status,
      customerId,
      market: scannedMarket,
      signal,
      risk,
      execution
    };
  }
};

export default Object.freeze(AfriForexTradingOrchestrator);
