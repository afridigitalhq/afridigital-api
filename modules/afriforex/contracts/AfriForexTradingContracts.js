export const AFRIFOREX_EXECUTION_MODES = ["demo"];

export const AFRIFOREX_SIGNAL_STATES = [
  "STRONG_BUY",
  "BUY",
  "WAIT",
  "SELL",
  "STRONG_SELL"
];

export const AFRIFOREX_POSITION_STATES = [
  "OPEN",
  "CLOSED"
];

export const AFRIFOREX_ASSET_TYPES = [
  "forex",
  "crypto",
  "commodity",
  "stock"
];

export const AFRIFOREX_TIMEFRAMES = ["1min", "5min", "15M", "1H", "4H", "1D", "1W", "1MO", "1Y"];

export const AFRIFOREX_TRADING_DEFAULTS = {
  horizon: "1-3d",
  strategy: "short_swing",
  primaryTimeframe: "4H",
  confirmationTimeframe: "1H",
  entryTimeframe: "15M",
  adaptiveTimeframes: true,
  executionMode: "demo",
  startingBalanceUsd: 1000
};

export function createTradingPreferences(input = {}) {
  return {
    customerId: input.customerId || "guest",
    allowedMarkets: Array.isArray(input.allowedMarkets)
      ? [...input.allowedMarkets]
      : [],
    preferredMarkets: Array.isArray(input.preferredMarkets)
      ? [...input.preferredMarkets]
      : [],
    maxActivePositions: Number.isFinite(input.maxActivePositions)
      ? input.maxActivePositions
      : 5,
    riskPerTradePercent: Number.isFinite(input.riskPerTradePercent)
      ? input.riskPerTradePercent
      : 1,
    ...AFRIFOREX_TRADING_DEFAULTS,
    ...input
  };
}

export function createTradingAccount(input = {}) {
  const startingBalanceUsd = Number.isFinite(input.startingBalanceUsd)
    ? input.startingBalanceUsd
    : AFRIFOREX_TRADING_DEFAULTS.startingBalanceUsd;

  return {
    accountId: input.accountId || `afriforex_demo_${input.customerId || "guest"}`,
    customerId: input.customerId || "guest",
    mode: "demo",
    currency: "USD",
    balance: startingBalanceUsd,
    equity: startingBalanceUsd,
    usedMargin: 0,
    availableMargin: startingBalanceUsd,
    activePositionCount: 0,
    status: "ACTIVE"
  };
}

export function createTradePosition(input = {}) {
  return {
    positionId: input.positionId || `afriforex_pos_${Date.now()}`,
    accountId: input.accountId || null,
    customerId: input.customerId || "guest",
    assetType: input.assetType || null,
    symbol: input.symbol || null,
    direction: input.direction || null,
    status: "OPEN",
    entryPrice: input.entryPrice ?? null,
    stopLoss: input.stopLoss ?? null,
    takeProfit: input.takeProfit ?? null,
    quantity: input.quantity ?? null,
    lotSize: input.lotSize ?? null,
    leverage: input.leverage ?? null,
    marginRequired: input.marginRequired ?? null,
    riskAmount: input.riskAmount ?? null,
    riskPercent: input.riskPercent ?? null,
    rewardRisk: input.rewardRisk ?? null,
    confidence: input.confidence ?? null,
    signal: input.signal || null,
    reason: input.reason || null,
    exitPrice: input.exitPrice ?? null,
    realizedPnl: input.realizedPnl ?? null,
    closeReason: input.closeReason || null,
    closedSignal: input.closedSignal || null,
    openedAt: input.openedAt || new Date().toISOString(),
    closedAt: null
  };
}
