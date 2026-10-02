export const AFRI_CRYPTO_FEE_CONTRACT = Object.freeze({
  module: "AfriCrypto",
  component: "FeeEngine",
  adminConfigurable: true,
  percentageBased: true,
  supportsMinimum: true,
  supportsMaximum: true,
  operations: [
    "SEND",
    "RECEIVE",
    "NFT_TRANSFER",
    "SWAP"
  ]
});
