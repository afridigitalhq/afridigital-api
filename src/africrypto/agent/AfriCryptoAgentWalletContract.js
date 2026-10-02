export const AFRI_CRYPTO_AGENT_WALLET_CAPABILITIES = Object.freeze([
  "wallet.address",
  "wallet.balance",
  "wallet.assets",
  "wallet.nfts",
  "wallet.receive",
  "wallet.transfer.request",
  "wallet.transaction.status",
  "wallet.permissions",
  "wallet.revoke"
]);

export const AFRI_CRYPTO_AGENT_WALLET_CONTRACT = Object.freeze({
  component: "AgentWalletAccess",
  ownerRemainsController: true,
  privateKeyExposure: false,
  capabilityBased: true,
  capabilities: AFRI_CRYPTO_AGENT_WALLET_CAPABILITIES
});
