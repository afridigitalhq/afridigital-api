export const AFRI_CRYPTO_DOMAIN_CONTRACT = Object.freeze({
  module: "AfriCrypto",
  version: "1.0.0",
  assetTypes: [
    "NATIVE",
    "FUNGIBLE",
    "STABLECOIN",
    "NFT"
  ],
  nftStandards: [
    "ERC721",
    "ERC1155"
  ],
  transactionLayer: true,
  policyLayer: true
});
