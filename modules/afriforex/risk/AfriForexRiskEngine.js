import AfriForexLotCalculator from "../instruments/AfriForexLotCalculator.js";

function round(value, decimals = 6) {
  const factor = 10 ** decimals;
  return Math.round(Number(value) * factor) / factor;
}

const MAX_LEVERAGE = 2000;
const MIN_RISK_PERCENT = 0.1;
const MAX_RISK_PERCENT = 5;

const AfriForexRiskEngine = {
  calculate({ signal, account, preferences = {}, lotSize, leverage, stopLoss, takeProfit } = {}) {
    if (!signal?.tradeable || !signal?.price) return { status: "REJECTED", reason: "SIGNAL_NOT_TRADEABLE" };
    const balance = Number(account?.balance);
    const availableMargin = Number(account?.availableMargin);
    if (!Number.isFinite(balance) || balance <= 0) return { status: "REJECTED", reason: "INVALID_ACCOUNT_BALANCE" };
    if (!Number.isFinite(availableMargin) || availableMargin < 0 ) return { status: "REJECTED", reason: "INVALID_AVAILABLE_MARGIN" };
    const entryPrice = Number(signal.price);
    if (!Number.isFinite(entryPrice) || entryPrice <= 0) return { status: "REJECTED", reason: "INVALID_ENTRY_PRICE" };
    const direction = signal.signal === "BUY" || signal.signal === "STRONG_BUY" ? "BUY" : signal.signal === "SELL" || signal.signal === "STRONG_SELL" ? "SELL" : null;
    if (!direction) return { status: "REJECTED", reason: "NO_DIRECTION" };
    const stopDistancePercent = 0.02;
    const rewardRisk = 2;
    const defaultStop = direction === "BUY" ? entryPrice * (1 - stopDistancePercent) : entryPrice * (1 + stopDistancePercent);
    const defaultTake = direction === "BUY" ? entryPrice * (1 + stopDistancePercent * rewardRisk) : entryPrice * (1 - stopDistancePercent * rewardRisk);
    const finalStop = stopLoss == null ? defaultStop : Number(stopLoss);
    const finalTake = takeProfit == null ? defaultTake : Number(takeProfit);
    if (!Number.isFinite(finalStop) || finalStop <= 0) return { status: "REJECTED", reason: "INVALID_STOP_LOSS" };
    if (!Number.isFinite(finalTake) || finalTake <= 0) return { status: "REJECTED", reason: "INVALID_TAKE_PROFIT" };
    const priceRisk = Math.abs(entryPrice - finalStop);
    if (!Number.isFinite(priceRisk) || priceRisk <= 0) return { status: "REJECTED", reason: "INVALID_STOP_DISTANCE" };
    const requestedLotSize = lotSize ?? preferences.defaultLotSize ?? preferences.lotSize ?? 0.01;
    const calculated = AfriForexLotCalculator.calculate(signal.symbol, requestedLotSize);
    if (calculated.status !== "CALCULATED") return calculated;
    const numericLeverage = Number(leverage ?? preferences.leverage ?? 2000);
        if (!Number.isFinite(numericLeverage) || numericLeverage <= 0) return { status: "REJECTED", reason: "INVALID_LEVERAGE" };
    const safeLeverage = Math.min(Math.max(numericLeverage, 1), MAX_LEVERAGE);
    const notional = calculated.quantity * entryPrice;
    const marginRequired = notional / safeLeverage;
    const riskAmount = calculated.quantity * priceRisk;
    const riskPercent = (riskAmount / balance) * 100;
    if (riskPercent > MAX_RISK_PERCENT) return { status: "REJECTED", reason: "RISK_PERCENT_ABOVE_LIMIT", lotSize: calculated.lotSize, riskAmount: round(riskAmount, 2), riskPercent: round(riskPercent, 2), maxRiskPercent: MAX_RISK_PERCENT };
    const reward = calculated.quantity * Math.abs(finalTake - entryPrice);
    const rewardRiskValue = riskAmount > 0 ? reward / riskAmount : rewardRisk;
    if (marginRequired > availableMargin) return { status: "REJECTED", reason: "INSUFFICIENT_AVAILABLE_MARGIN", marginRequired: round(marginRequired,2), availableMargin: round(availableMargin,2) };
    return { status: "APPROVED", direction, entryPrice: round(entryPrice), stopLoss: round(finalStop), takeProfit: round(finalTake), quantity: calculated.quantity, lotSize: calculated.lotSize, contractSize: calculated.contractSize, quantityUnit: calculated.quantityUnit, leverage: safeLeverage, notional: round(notional,2), marginRequired: round(marginRequired,2), riskAmount: round(riskAmount,2), riskPercent: round(riskPercent,2), rewardRisk: round(rewardRiskValue,2), confidence: signal.confidence, signal: signal.signal, reason: signal.reason, model: "LOT_CONTRACT_V1", limitations: ["quote-level evidence only", "candle/ATR confirmation unavailable"]};
  }
};

export default AfriForexRiskEngine;
