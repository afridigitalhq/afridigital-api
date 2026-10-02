export const AFRI_CRYPTO_A2A_OPERATIONS = Object.freeze({
  PROVISION_WALLET: "wallet.provision",
  GET_ADDRESS: "wallet.address",
  GET_BALANCE: "wallet.balance",
  GET_ASSETS: "wallet.assets",
  GET_NFTS: "wallet.nfts",
  REQUEST_TRANSFER: "wallet.transfer.request",
  TRANSACTION_STATUS: "wallet.transaction.status",
  GET_PERMISSIONS: "wallet.permissions",
  REVOKE_ACCESS: "wallet.revoke"
});

export const AFRI_CRYPTO_A2A_CONTRACT = Object.freeze({
  component: "A2AWalletInterface",
  enabled: false,
  billingEnabled: false,
  executionEnabled: false,
  operations: Object.values(AFRI_CRYPTO_A2A_OPERATIONS)
});
