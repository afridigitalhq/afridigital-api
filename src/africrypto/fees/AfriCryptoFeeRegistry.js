import { AFRI_CRYPTO_FEE_OPERATIONS } from "./AfriCryptoFeeTypes.js";

const feeRules = new Map();

for (const operation of Object.values(AFRI_CRYPTO_FEE_OPERATIONS)) {
  feeRules.set(operation, {
    operation,
    enabled: false,
    percentage: 0,
    minimum: 0,
    maximum: null,
    updatedAt: null,
    updatedBy: null
  });
}

export function getFeeRule(operation) {
  return feeRules.get(operation) || null;
}

export function listFeeRules() {
  return [...feeRules.values()];
}

export function updateFeeRule(operation, {
  enabled = false,
  percentage = 0,
  minimum = 0,
  maximum = null,
  updatedBy = "system"
} = {}) {
  if (!feeRules.has(operation)) {
    throw new Error("AFRICRYPTO_FEE_OPERATION_NOT_SUPPORTED");
  }

  const normalizedPercentage = Number(percentage);
  const normalizedMinimum = Number(minimum);
  const normalizedMaximum =
    maximum === null || maximum === undefined ? null : Number(maximum);

  if (!Number.isFinite(normalizedPercentage) || normalizedPercentage < 0) {
    throw new Error("AFRICRYPTO_FEE_PERCENTAGE_INVALID");
  }

  if (!Number.isFinite(normalizedMinimum) || normalizedMinimum < 0) {
    throw new Error("AFRICRYPTO_FEE_MINIMUM_INVALID");
  }

  if (
    normalizedMaximum !== null &&
    (!Number.isFinite(normalizedMaximum) || normalizedMaximum < normalizedMinimum)
  ) {
    throw new Error("AFRICRYPTO_FEE_MAXIMUM_INVALID");
  }

  const rule = {
    operation,
    enabled: Boolean(enabled),
    percentage: normalizedPercentage,
    minimum: normalizedMinimum,
    maximum: normalizedMaximum,
    updatedAt: new Date().toISOString(),
    updatedBy
  };

  feeRules.set(operation, Object.freeze(rule));
  return feeRules.get(operation);
}
