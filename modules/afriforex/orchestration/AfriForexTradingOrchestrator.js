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
import AfriForexEconomicCalendarEngine from "../fundamentals/calendar/AfriForexEconomicCalendarEngine.js";
import AfriPlatformEventBus from "../../platform/events/bus/AfriPlatformEventBus.js";

const monitoredScalpState = new Map();

async function buildSignalMarket(market) {
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

  const economicCalendar =
    await AfriForexEconomicCalendarEngine.analyze({
      symbol: market.displaySymbol || market.symbol,
      assetType: market.assetType
    });

  const intelligenceAnalysis =
    AfriForexIntelligenceEngine.analyze({
      symbol: market.displaySymbol || market.symbol,
      candlesByTimeframe,
      economicCalendar
    });

  const horizonIntelligence =
    AfriForexHorizonIntelligenceEngine.analyze({
      symbol: market.displaySymbol || market.symbol,
      candlesByTimeframe,
      timeframeEvidence:
        intelligenceAnalysis?.timeframeEvidence &&
        typeof intelligenceAnalysis.timeframeEvidence === "object"
          ? Object.fromEntries(
              intelligenceAnalysis.timeframeEvidence.map(item => [
                item.timeframe,
                item
              ])
            )
          : {},
      momentumEvidence: intelligenceAnalysis?.evidence?.momentum || {},
      marketStructure: intelligenceAnalysis?.evidence?.marketStructure || {},
      excludeHorizons: ["SCALP"]
    });

  horizonIntelligence.horizons.SCALP = {
    horizon: "SCALP",
    symbol: market.displaySymbol || market.symbol,
    direction:
      intelligenceAnalysis?.scalp?.direction || "NEUTRAL",
    setupState:
      intelligenceAnalysis?.setupState || "DEVELOPING",
    tradeDecision:
      intelligenceAnalysis?.tradeDecision || "WAIT",
    confidence:
      intelligenceAnalysis?.confidence ?? 0,
    scalpMomentumStrengthPercent:
      intelligenceAnalysis?.scalpMomentumStrengthPercent ?? 0,
    weightedScore:
      intelligenceAnalysis?.scoring?.scalpScore ?? 0,
    availableTimeframes:
      intelligenceAnalysis?.scoring?.availableTimeframes
        ? ["1min", "5min", "15M", "1H"]
        : [],
    timeframes: ["1min", "5min", "15M", "1H"],
    evidence:
      intelligenceAnalysis?.evidence || {},
    dataMode: market.dataMode || "UNKNOWN",
    monitorState:
      intelligenceAnalysis?.setupState === "CONFLICT"
        ? "WARNING"
        : intelligenceAnalysis?.tradeDecision === "ENTER"
          ? "READY"
          : "DEVELOPING",
    entryApproaching: false,
    warning:
      intelligenceAnalysis?.setupState === "CONFLICT"
        ? {
            state: "TRADE_WARNING",
            reason: "SCALP_INTELLIGENCE_CONFLICT"
          }
        : null,
    reason:
      intelligenceAnalysis?.reason || "SCALP_CANONICAL_INTELLIGENCE",
    reversal:
      intelligenceAnalysis?.reversal &&
      typeof intelligenceAnalysis.reversal === "object"
        ? intelligenceAnalysis.reversal
        : null
  };

  return {
    symbol: market.displaySymbol || market.symbol,
    assetType: market.assetType,
    evidence: market.evidence || [],
    multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
    intelligenceAnalysis,
    horizonIntelligence,
    economicCalendar,
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
  async scan(customerId = "guest", markets = null, crossAssetEnabled = false, options = {}) {
    const source = options?.source === "MONITORED" ? "MONITORED" : "MANUAL";
    const scan = await AfriForexMarketScanner.scan(customerId, markets);
    const account = AfriForexDemoStore.getAccount(customerId);
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const results = await Promise.all(scan.results.map(async (market) => {
      const signalMarket = await buildSignalMarket(market);

      const signal = AfriForexSignalEngine.evaluate(
        signalMarket
      );

      const horizonIntelligence =
        signalMarket.horizonIntelligence || {};
      const horizonSignalInput = {
        ...(horizonIntelligence.horizons || {}),
        dataMode: signalMarket.dataMode
      };

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
        ...signalMarket,
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
        economicCalendar: signalMarket.economicCalendar || null,
        observedAt: new Date().toISOString()
      });

      AfriPlatformEventBus.publish("TRADE_SIGNAL", {
        source: "AfriForexTradingOrchestrator",
        symbol: market.displaySymbol || market.symbol,
        assetType: market.assetType,
        signal,
        risk,
        multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
        economicCalendar: signalMarket.economicCalendar || null,
        observedAt: new Date().toISOString()
      });

      const scalpSignal = adaptedHorizonSignals.SCALP || null;
      const supportingHorizonSignals = Object.values(adaptedHorizonSignals)
        .filter((item) => item.horizon !== "SCALP");

      const scalpDirection = String(
        scalpSignal?.direction || signal?.direction || "NEUTRAL"
      ).toUpperCase();

      const scalpTradeable = Boolean(
        scalpSignal?.tradeable &&
        scalpSignal?.direction &&
        scalpDirection !== "NEUTRAL"
      );

      const transitionKey =
        String(customerId) + "::" + String(market.displaySymbol || market.symbol);

      const previousScalpState =
        source === "MONITORED"
          ? monitoredScalpState.get(transitionKey) || null
          : null;

      const directionChanged = Boolean(
        source === "MONITORED" &&
        previousScalpState &&
        previousScalpState.direction !== scalpDirection &&
        scalpDirection !== "NEUTRAL"
      );

      const monitoredTradeAlert = Boolean(
        source === "MONITORED" &&
        previousScalpState &&
        directionChanged
      );

      if (source === "MONITORED") {
        monitoredScalpState.set(transitionKey, {
          direction: scalpDirection,
          observedAt: new Date().toISOString()
        });
      }

      const shouldPublishTradeAlert =
        source === "MANUAL"
          ? scalpTradeable
          : monitoredTradeAlert;

      const tradeableSupportingHorizons = supportingHorizonSignals.filter(
        (item) => item.tradeable
      );

      const gatedSupportingHorizons = supportingHorizonSignals.map((item) => ({
        ...item,
        readiness:
          item.tradeable
            ? (
                String(item.direction || "NEUTRAL").toUpperCase() === scalpDirection
                  ? "READY_WITH_SCALP_ALIGNMENT"
                  : "READY_PENDING_SCALP"
              )
            : item.entryApproaching
              ? "ENTRY_APPROACHING"
              : item.monitorState === "WARNING"
                ? "WARNING"
                : "DEVELOPING"
      }));

      if (shouldPublishTradeAlert) {
        const canonicalRisk = signal.tradeable ? risk : {
          status: "NOT_CALCULATED",
          reason: "SCALP_PRIMARY_SIGNAL"
        };

        AfriPlatformEventBus.publish("TRADE_ALERT", {
          source: "AfriForexTradingOrchestrator",
          symbol: market.displaySymbol || market.symbol,
          assetType: market.assetType,
          dataMode: signalMarket.dataMode || "UNKNOWN",
          signal: {
            ...scalpSignal,
            direction: scalpDirection,
            alertState: scalpDirection
          },
          risk: canonicalRisk,
          primaryHorizon: "SCALP",
          intelligenceAnalysis: signalMarket.intelligenceAnalysis || null,
          economicCalendar: signalMarket.economicCalendar || null,
          horizonIntelligence: signalMarket.horizonIntelligence || null,
          horizons: adaptedHorizonSignals,
          tradeableHorizons: ["SCALP"],
          supportingTradeableHorizons: tradeableSupportingHorizons.map((item) => item.horizon),
          multiTimeframeAnalysis: market.multiTimeframeAnalysis || null,
          observedAt: new Date().toISOString()
        });
      }

      for (const horizon of gatedSupportingHorizons) {
        if (
          horizon.monitorState === "DEVELOPING" &&
          !horizon.entryApproaching
        ) {
          continue;
        }

        const alignedWithScalp =
          String(horizon.direction || "NEUTRAL").toUpperCase() === scalpDirection;

        AfriPlatformEventBus.publish("HORIZON_ALERT", {
          source: "AfriForexTradingOrchestrator",
          symbol: market.displaySymbol || market.symbol,
          assetType: market.assetType,
          horizon: horizon.horizon,
          signal: horizon,
          primaryHorizon: "SCALP",
          scalp: {
            direction: scalpDirection,
            tradeable: scalpTradeable,
            aligned: alignedWithScalp
          },
          readiness: horizon.readiness,
          warning: horizon.warning || null,
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

    const signalMarket = await buildSignalMarket(scannedMarket);

    const signal = AfriForexSignalEngine.evaluate(
      signalMarket
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
