import { getFeeRule } from "./AfriCryptoFeeRegistry.js";

export function calculateAfriCryptoFee({
  operation,
  amount
} = {}) {
  const rule = getFeeRule(operation);

  if (!rule) {
    throw new Error("AFRICRYPTO_FEE_OPERATION_NOT_SUPPORTED");
  }

  const normalizedAmount = Number(amount);

  if (!Number.isFinite(normalizedAmount) || normalizedAmount < 0) {
    throw new Error("AFRICRYPTO_FEE_AMOUNT_INVALID");
  }

  if (!rule.enabled || rule.percentage <= 0) {
    return {
      operation,
      amount: normalizedAmount,
      fee: 0,
      percentage: rule.percentage,
      enabled: false
    };
  }

  let fee = normalizedAmount * (rule.percentage / 100);

  if (fee < rule.minimum) {
    fee = rule.minimum;
  }

  if (rule.maximum !== null && fee > rule.maximum) {
    fee = rule.maximum;
  }

  return {
    operation,
    amount: normalizedAmount,
    fee,
    percentage: rule.percentage,
    enabled: true
  };
}
