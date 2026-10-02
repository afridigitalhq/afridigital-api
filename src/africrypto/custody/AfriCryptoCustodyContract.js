export const AFRI_CRYPTO_CUSTODY_MODES = Object.freeze({
  SELF_CUSTODY: "SELF_CUSTODY",
  MANAGED_CUSTODY: "MANAGED_CUSTODY"
});

export const AFRI_CRYPTO_CUSTODY_CONTRACT = Object.freeze({
  component: "CustodyBoundary",
  ownerControlsKeys: true,
  agentReceivesPrivateKeys: false,
  supportsRecovery: true,
  supportsSigningBoundary: true,
  modes: Object.values(AFRI_CRYPTO_CUSTODY_MODES)
});
