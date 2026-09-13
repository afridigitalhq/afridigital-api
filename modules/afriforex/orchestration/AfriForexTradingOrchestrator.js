import AfriForexMarketScanner from "../scanner/AfriForexMarketScanner.js";
import AfriForexIntelligenceEngine from "../intelligence/AfriForexIntelligenceEngine.js";
import AfriForexHorizonIntelligenceEngine from "../intelligence/AfriForexHorizonIntelligenceEngine.js";
import AfriForexHorizonSignalContract from "../signals/AfriForexHorizonSignalContract.js";
import AfriForexHorizonSignalAdapter from "../signals/AfriForexHorizonSignalAdapter.js";
import AfriForexSignalEngine from "../signals/AfriForexSignalEngine.js";
import AfriForexRiskEngine from "../risk/AfriForexRiskEngine.js";
import AfriForexDemoExecutionEngine from "../execution/AfriForexDemoExecutionEngine.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";
import AfriForexPositionDecisionEngine from "../position/AfriForexPositionDecisionEngine.js";
import AfriForexCrossAssetContextEngine from "../correlation/AfriForexCrossAssetContextEngine.js";
import AfriPlatformEventBus from "../../platform/events/bus/AfriPlatformEventBus.js";

function buildSignalMarket(market) {
  const candlesByTimeframe = {};

  for (const providerResult of market.candleEvidence?.results || []) {
    for (const [timeframe, item] of Object.entries(
      providerResult.timeframes || {}
    )) {
      const candles = item?.evidence?.data?.candles;

      if (
        item?.status === "AVAILABLE" &&
        Array.isArray(candles) &&
        candles.length &&
        !candlesByTimeframe[timeframe]
      ) {
        candlesByTimeframe[timeframe] = candles;
      }
    }
  }

  const latestCandle = Object.values(candlesByTimeframe)
    .filter((candles) => Array.isArray(candles) && candles.length)
    .map((candles) => candles[candles.length - 1])
    .filter(Boolean)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;

  const dataMode = market.dataMode ||
    Object.values(market.candleEvidence?.results || {})
      .flatMap((providerResult) => Object.values(providerResult?.timeframes || {}))
      .find((item) => item?.evidence?.meta?.dataMode)
      ?.evidence?.meta?.dataMode ||
    "UNKNOWN";

  const intelligenceAnalysis =
    AfriForexIntelligenceEngine.analyze({
      symbol: market.displaySymbol || market.symbol,
      candlesByTimeframe,
      mtf: market.multiTimeframeAnalysis || {}
    });

  const horizonIntelligence =
    AfriForexHorizonIntelligenceEngine.analyze({
      symbol: market.displaySymbol || market.symbol,
      candlesByTimeframe,
      excludeHorizons: ["SCALP"],
      timeframeEvidence: intelligenceAnalysis?.evidence?.indicators || {},
      momentumEvidence: intelligenceAnalysis?.evidence?.momentum || {},
      marketStructure: intelligenceAnalysis?.evidence?.marketStructure || {}
    });

  return {
    symbol: market.displaySymbol || market.symbol,
    assetType: market.assetType,
    evidence: market.evidence || [],
    multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
    intelligenceAnalysis,
    horizonIntelligence,
    price: market.price ?? latestCandle?.close ?? null,
    dataMode
  };
}

function sameSymbol(position, market) {
  const positionSymbol = String(position?.symbol || "").toUpperCase();
  const marketSymbol = String(market?.symbol || "").toUpperCase();
  const displaySymbol = String(market?.displaySymbol || "").toUpperCase();

  return (
    positionSymbol === marketSymbol ||
    positionSymbol === displaySymbol ||
    positionSymbol.replace("BINANCE:", "") ===
      marketSymbol.replace("BINANCE:", "") ||
    positionSymbol.replace("BINANCE:", "") ===
      displaySymbol.replace("BINANCE:", "").replace("/", "")
  );
}

function calculateProjectedAccountAfterClose(account, position, exitPrice) {
  const entryPrice = Number(position?.entryPrice);
  const quantity = Number(position?.quantity);
  const exit = Number(exitPrice);

  if (
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(exit)
  ) {
    return null;
  }

  const priceDifference =
    position.direction === "BUY"
      ? exit - entryPrice
      : entryPrice - exit;

  const realizedPnl =
    Math.round(priceDifference * quantity * 100) / 100;

  const releasedMargin = Number(position.marginRequired) || 0;
  const balance =
    Math.round((Number(account.balance) + realizedPnl) * 100) / 100;
  const usedMargin = Math.max(
    0,
    Math.round((Number(account.usedMargin) - releasedMargin) * 100) / 100
  );

  return {
    ...account,
    balance,
    equity: balance,
    usedMargin,
    availableMargin:
      Math.round((balance - usedMargin) * 100) / 100,
    activePositionCount: Math.max(
      0,
      Number(account.activePositionCount || 0) - 1
    )
  };
}

const AfriForexTradingOrchestrator = {
  async scan(customerId = "guest", markets = null, crossAssetEnabled = false) {
    const scan = await AfriForexMarketScanner.scan(customerId, markets);
    const account = AfriForexDemoStore.getAccount(customerId);
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const results = await Promise.all(scan.results.map(async (market) => {
      const signalMarket = buildSignalMarket(market);

      const signal = AfriForexSignalEngine.evaluate(
        signalMarket
      );

      const horizonIntelligence =
        signalMarket.horizonIntelligence || {};

        const horizonSignalInput = { ...(horizonIntelligence.horizons || horizonIntelligence), SCALP: { horizon: "SCALP", symbol: market.displaySymbol || market.symbol, timeframes: ["1min", "5min", "15M", "1H"], direction: intelligenceAnalysis?.scalp?.direction || "NEUTRAL", setupState: intelligenceAnalysis?.setupState || "DEVELOPING", tradeDecision: intelligenceAnalysis?.tradeDecision || "WAIT", confidence: Number(intelligenceAnalysis?.confidence) || 0, availableTimeframes: Array.isArray(intelligenceAnalysis?.timeframeEvidence) ? intelligenceAnalysis.timeframeEvidence.filter(item => item?.status === "AVAILABLE").map(item => item.timeframe) : [], weightedScore: Number(intelligenceAnalysis?.scalp?.score) || 0, evidence: intelligenceAnalysis?.scalp || {}, dataMode: signalMarket.dataMode, reason: intelligenceAnalysis?.reason || "CANONICAL_SCALP" } };
      const horizonSignals =
        AfriForexHorizonSignalContract.buildAll({
          symbol: market.displaySymbol || market.symbol,
          dataMode: signalMarket.dataMode,
            horizons: horizonSignalInput
          });
      const adaptedHorizonSignals =
        AfriForexHorizonSignalAdapter.buildAll(
          horizonSignals,
          {
            symbol: market.displaySymbol || market.symbol,
            price: signalMarket.price ?? null,
            dataMode: signalMarket.dataMode
          }
        );

      const crossAssetContext = crossAssetEnabled
        ? await AfriForexCrossAssetContextEngine.analyze({
            symbol: market.displaySymbol || market.symbol,
            assetType: market.assetType,
            scalpSignal: adaptedHorizonSignals.SCALP,
            referenceCandleEvidence: market.candleEvidence
          })
        : {
            status: "OFF",
            symbol: market.displaySymbol || market.symbol,
            driver: "SCALP",
            scalpDirection: adaptedHorizonSignals.SCALP?.direction || "NEUTRAL",
            scalpConfidence: adaptedHorizonSignals.SCALP?.confidence || 0,
            bias: "UNAVAILABLE",
            evidence: "UNAVAILABLE",
            confidence: 0,
            counts: { supporting: 0, against: 0, neutral: 0, unavailable: 0 },
            evaluatedAssets: 0,
            universeSize: 0,
            referenceAvailableTimeframes: [],
            assets: [],
            reason: "CROSS_ASSET_DISABLED"
          };

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

      const result = {
        ...market,
        signal,
        risk,
        horizonSignals: adaptedHorizonSignals,
        crossAssetContext
      };

      const primaryTimeframe = "4H";
      const primaryCandles = [];

      for (const providerResult of market.candleEvidence?.results || []) {
        const item = providerResult.timeframes?.[primaryTimeframe];

        if (
          item?.status === "AVAILABLE" &&
          item?.evidence?.data?.candles?.length
        ) {
          primaryCandles.push(
            ...item.evidence.data.candles
          );
          break;
        }
      }

      AfriPlatformEventBus.publish("MARKET_UPDATE", {
        source: "AfriForexTradingOrchestrator",
        symbol: market.displaySymbol || market.symbol,
        assetType: market.assetType,
        timeframe: primaryTimeframe,
        candles: primaryCandles,
        multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
        observedAt: new Date().toISOString()
      });

      AfriPlatformEventBus.publish("TRADE_SIGNAL", {
        source: "AfriForexTradingOrchestrator",
        symbol: market.displaySymbol || market.symbol,
        assetType: market.assetType,
        signal,
        risk,
        multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
        observedAt: new Date().toISOString()
      });

      const tradeableHorizonSignals = Object.values(
        adaptedHorizonSignals
      ).filter((item) => item.tradeable);

      if (
        signal.tradeable &&
        ["BUY", "SELL", "STRONG_BUY", "STRONG_SELL"].includes(signal.state)
      ) {
        AfriPlatformEventBus.publish("TRADE_ALERT", {
          source: "AfriForexTradingOrchestrator",
          symbol: market.displaySymbol || market.symbol,
          assetType: market.assetType,
          dataMode:
            signalMarket.dataMode ||
            "UNKNOWN",
          signal,
          risk,
          intelligenceAnalysis: signalMarket.intelligenceAnalysis || null,
          horizonIntelligence: signalMarket.horizonIntelligence || null,
          horizons: adaptedHorizonSignals,
          tradeableHorizons: tradeableHorizonSignals.map(
            (item) => item.horizon
          ),
          multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
          observedAt: new Date().toISOString()
        });
      } else if (tradeableHorizonSignals.length) {
        AfriPlatformEventBus.publish("TRADE_ALERT", {
          source: "AfriForexTradingOrchestrator",
          symbol: market.displaySymbol || market.symbol,
          assetType: market.assetType,
          dataMode:
            signalMarket.dataMode ||
            "UNKNOWN",
          signal: null,
          risk: {
            status: "NOT_CALCULATED",
            reason: "HORIZON_ALERT_ONLY"
          },
          horizons: adaptedHorizonSignals,
          tradeableHorizons: tradeableHorizonSignals.map(
            (item) => item.horizon
          ),
          multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
          observedAt: new Date().toISOString()
        });
      }

      return result;
    }));

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
    let account = AfriForexDemoStore.getAccount(customerId);
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

    const openPositions =
      AfriForexDemoStore.getOpenPositions(customerId);

    const existingPosition =
      openPositions.find((position) =>
        sameSymbol(position, scannedMarket)
      ) || null;

    const positionDecision =
      AfriForexPositionDecisionEngine.decide({
        position: existingPosition,
        signal,
        multiTimeframeAnalysis:
          scannedMarket.multiTimeframeAnalysis
      });

    if (
      existingPosition &&
      positionDecision.decision ===
        AfriForexPositionDecisionEngine.DECISIONS.HOLD
    ) {
      return {
        status: "HOLD",
        customerId,
        market: scannedMarket,
        signal,
        positionDecision,
        position: existingPosition,
        account
      };
    }

    if (
      existingPosition &&
      positionDecision.decision ===
        AfriForexPositionDecisionEngine.DECISIONS.WAIT
    ) {
      return {
        status: "WAIT",
        customerId,
        market: scannedMarket,
        signal,
        positionDecision,
        position: existingPosition,
        account
      };
    }

    if (
      existingPosition &&
      positionDecision.decision ===
        AfriForexPositionDecisionEngine.DECISIONS.CLOSE
    ) {
      const closeExecution =
        AfriForexDemoExecutionEngine.close({
          customerId,
          positionId: existingPosition.positionId,
          exitPrice: signal.price,
          reason: positionDecision.reason,
          signal
        });

      return {
        status: closeExecution.status,
        customerId,
        market: scannedMarket,
        signal,
        positionDecision,
        closeExecution,
        account: closeExecution.account || account
      };
    }

    let riskAccount = account;

    if (
      existingPosition &&
      positionDecision.decision ===
        AfriForexPositionDecisionEngine.DECISIONS.REVERSE
    ) {
      const projectedAccount =
        calculateProjectedAccountAfterClose(
          account,
          existingPosition,
          signal.price
        );

      if (!projectedAccount) {
        return {
          status: "REJECTED",
          reason: "REVERSAL_CLOSE_PROJECTION_FAILED",
          customerId,
          market: scannedMarket,
          signal,
          positionDecision,
          position: existingPosition
        };
      }

      riskAccount = projectedAccount;
    }

    const risk = AfriForexRiskEngine.calculate({
      signal,
      account: riskAccount,
      preferences,
      lotSize,
      leverage,
      stopLoss,
      takeProfit
    });

    if (risk.status !== "APPROVED") {
      return {
        status: "REJECTED",
        reason: existingPosition
          ? "POSITION_CHANGE_RISK_NOT_APPROVED"
          : "RISK_NOT_APPROVED",
        customerId,
        market: scannedMarket,
        signal,
        positionDecision,
        risk,
        position: existingPosition || null,
        account
      };
    }

    if (
      existingPosition &&
      positionDecision.decision ===
        AfriForexPositionDecisionEngine.DECISIONS.REVERSE
    ) {
      const closeExecution =
        AfriForexDemoExecutionEngine.close({
          customerId,
          positionId: existingPosition.positionId,
          exitPrice: signal.price,
          reason: positionDecision.reason,
          signal
        });

      if (closeExecution.status !== "CLOSED") {
        return {
          status: "REJECTED",
          reason: "REVERSAL_CLOSE_FAILED",
          customerId,
          market: scannedMarket,
          signal,
          positionDecision,
          risk,
          closeExecution,
          account
        };
      }

      account = closeExecution.account;

      const finalRisk =
        AfriForexRiskEngine.calculate({
          signal,
          account,
          preferences,
          lotSize,
          leverage,
          stopLoss,
          takeProfit
        });

      if (finalRisk.status !== "APPROVED") {
        return {
          status: "REVERSE_PARTIAL",
          reason: "REVERSE_CLOSED_BUT_NEW_RISK_NOT_APPROVED",
          customerId,
          market: scannedMarket,
          signal,
          positionDecision,
          previousPosition: closeExecution.position,
          closeExecution,
          risk: finalRisk,
          account
        };
      }

      const execution =
        AfriForexDemoExecutionEngine.open({
          customerId,
          market: scannedMarket,
          signal,
          risk: finalRisk
        });

      return {
        status:
          execution.status === "OPENED"
            ? "REVERSED"
            : "REVERSE_PARTIAL",
        customerId,
        market: scannedMarket,
        signal,
        positionDecision,
        previousPosition: closeExecution.position,
        closeExecution,
        risk: finalRisk,
        execution
      };
    }

    const execution =
      AfriForexDemoExecutionEngine.open({
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
      positionDecision,
      risk,
      execution
    };
  }
};

export default Object.freeze(AfriForexTradingOrchestrator);
