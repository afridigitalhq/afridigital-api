export const AFRI_CRYPTO_BILLING_MODELS = Object.freeze({
  PER_REQUEST: "PER_REQUEST",
  PERCENTAGE: "PERCENTAGE",
  SUBSCRIPTION: "SUBSCRIPTION"
});

export const AFRI_CRYPTO_BILLING_CONTRACT = Object.freeze({
  component: "WalletServiceBilling",
  enabled: false,
  adminConfigurable: true,
  supportsPerRequest: true,
  supportsPercentage: true,
  supportsSubscription: true,
  models: Object.values(AFRI_CRYPTO_BILLING_MODELS)
});
