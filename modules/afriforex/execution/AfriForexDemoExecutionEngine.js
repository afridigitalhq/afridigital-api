import {
  createTradePosition
} from "../contracts/AfriForexTradingContracts.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";
import AfriPlatformEventBus from "../../platform/events/bus/AfriPlatformEventBus.js";

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function calculateRealizedPnl(position, exitPrice) {
  const entryPrice = Number(position.entryPrice);
  const quantity = Number(position.quantity);
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

  return round(priceDifference * quantity, 2);
}

const AfriForexDemoExecutionEngine = {
  open({
    customerId = "guest",
    market = {},
    signal = {},
    risk = {}
  } = {}) {
    if (risk.status !== "APPROVED") {
      return {
        status: "REJECTED",
        reason: "RISK_NOT_APPROVED"
      };
    }

    const account = AfriForexDemoStore.getAccount(customerId);
    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const openPositions =
      AfriForexDemoStore.getOpenPositions(customerId);

    if (
      openPositions.length >=
      Number(preferences.maxActivePositions)
    ) {
      return {
        status: "REJECTED",
        reason: "MAX_ACTIVE_POSITIONS_REACHED",
        activePositionCount: openPositions.length,
        maxActivePositions: preferences.maxActivePositions
      };
    }

    if (
      Number(risk.marginRequired) >
      Number(account.availableMargin)
    ) {
      return {
        status: "REJECTED",
        reason: "INSUFFICIENT_AVAILABLE_MARGIN"
      };
    }

    const position = createTradePosition({
      accountId: account.accountId,
      customerId,
      assetType: market.assetType,
      symbol: market.symbol,
      direction: risk.direction,
      entryPrice: risk.entryPrice,
      stopLoss: risk.stopLoss,
      takeProfit: risk.takeProfit,
      quantity: risk.quantity,
      lotSize: risk.lotSize,
      leverage: risk.leverage,
      marginRequired: risk.marginRequired,
      riskAmount: risk.riskAmount,
      riskPercent: risk.riskPercent,
      rewardRisk: risk.rewardRisk,
      confidence: risk.confidence,
      signal: risk.signal,
      reason: risk.reason
    });

    account.usedMargin =
      Number(account.usedMargin) +
      Number(risk.marginRequired);

    account.availableMargin =
      Number(account.balance) -
      account.usedMargin;

    account.activePositionCount =
      openPositions.length + 1;

    account.equity = account.balance;

    AfriForexDemoStore.saveAccount(account);
    AfriForexDemoStore.savePosition(position);

    AfriPlatformEventBus.publish("TRADE_OPENED", {
      position,
      account: {
        accountId: account.accountId,
        balance: account.balance,
        equity: account.equity,
        usedMargin: account.usedMargin,
        availableMargin: account.availableMargin,
        activePositionCount: account.activePositionCount
      }
    });

    return {
      status: "OPENED",
      mode: "demo",
      position,
      account
    };
  },

  close({
    customerId = "guest",
    positionId,
    exitPrice,
    reason = "MANUAL_CLOSE",
    signal = null
  } = {}) {
    if (!positionId) {
      return {
        status: "REJECTED",
        reason: "POSITION_ID_REQUIRED"
      };
    }

    const openPositions =
      AfriForexDemoStore.getOpenPositions(customerId);

    const position =
      openPositions.find(item => item.positionId === positionId);

    if (!position) {
      return {
        status: "REJECTED",
        reason: "OPEN_POSITION_NOT_FOUND"
      };
    }

    const finalExitPrice = Number(exitPrice);

    if (!Number.isFinite(finalExitPrice) || finalExitPrice <= 0) {
      return {
        status: "REJECTED",
        reason: "INVALID_EXIT_PRICE"
      };
    }

    const realizedPnl =
      calculateRealizedPnl(position, finalExitPrice);

    if (!Number.isFinite(realizedPnl)) {
      return {
        status: "REJECTED",
        reason: "REALIZED_PNL_UNAVAILABLE"
      };
    }

    const account =
      AfriForexDemoStore.getAccount(customerId);

    const releasedMargin =
      Number(position.marginRequired) || 0;

    const closedPosition =
      AfriForexDemoStore.closePosition(positionId, {
        exitPrice: round(finalExitPrice),
        realizedPnl,
        closeReason: reason,
        closedSignal: signal,
        customerId
      });

    if (!closedPosition) {
      return {
        status: "REJECTED",
        reason: "POSITION_CLOSE_FAILED"
      };
    }

    account.balance =
      round(Number(account.balance) + realizedPnl);

    account.usedMargin =
      Math.max(
        0,
        round(Number(account.usedMargin) - releasedMargin)
      );

    account.equity =
      round(account.balance);

    account.availableMargin =
      round(account.equity - account.usedMargin);

    account.activePositionCount =
      AfriForexDemoStore.getOpenPositions(customerId).length;

    AfriForexDemoStore.saveAccount(account);

    AfriPlatformEventBus.publish("TRADE_CLOSED", {
      position: closedPosition,
      account: {
        accountId: account.accountId,
        balance: account.balance,
        equity: account.equity,
        usedMargin: account.usedMargin,
        availableMargin: account.availableMargin,
        activePositionCount: account.activePositionCount
      }
    });

    return {
      status: "CLOSED",
      mode: "demo",
      position: closedPosition,
      account
    };
  }
};

export default AfriForexDemoExecutionEngine;
