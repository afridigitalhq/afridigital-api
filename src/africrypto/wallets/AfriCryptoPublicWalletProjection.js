import { listWallets } from "./AfriCryptoWalletRegistry.js";

export function listPublicWallets({
  ownerId = null,
  networkFamily = null
} = {}) {
  return listWallets()
    .flatMap(wallet =>
      wallet.addresses
        .filter(address =>
          address.environment === "MAINNET" &&
          (!ownerId || wallet.ownerId === ownerId) &&
          (!networkFamily || address.networkFamily === networkFamily)
        )
        .map(address => ({
          walletId: wallet.id,
          ownerId: wallet.ownerId,
          environment: address.environment,
          network: address.networkId,
          networkFamily: address.networkFamily,
          address: address.address,
          receivingEnabled: true
        }))
    );
}

export function getPublicWalletsForOwner(ownerId) {
  return listPublicWallets({ ownerId });
}
