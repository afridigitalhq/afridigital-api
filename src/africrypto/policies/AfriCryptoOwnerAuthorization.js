import { getWallet } from "../wallets/AfriCryptoWalletRegistry.js";

export function authorizeWalletOwner({
  walletId,
  authenticatedOwnerId
} = {}) {
  if (!walletId)
    throw new Error("AFRICRYPTO_WALLET_ID_REQUIRED");

  if (!authenticatedOwnerId)
    throw new Error("AFRICRYPTO_AUTHENTICATED_OWNER_REQUIRED");

  const wallet = getWallet(walletId);

  if (!wallet)
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");

  if (wallet.ownerId !== authenticatedOwnerId)
    throw new Error("AFRICRYPTO_OWNER_AUTHORIZATION_DENIED");

  return {
    authorized: true,
    walletId,
    ownerId: wallet.ownerId
  };
}
