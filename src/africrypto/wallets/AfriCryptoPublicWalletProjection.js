import { listWallets } from "./AfriCryptoWalletRegistry.js";

export function listPublicWallets({
  ownerId = null,
  agentId = null,
  networkFamily = null
} = {}) {
  return listWallets()
    .flatMap(wallet =>
      wallet.addresses
        .filter(address =>
          address.environment === "MAINNET" &&
          (!ownerId || wallet.ownerId === ownerId) &&
          (!agentId || wallet.agentId === agentId) &&
          (!networkFamily || address.networkFamily === networkFamily)
        )
        .map(address => ({
          walletId: wallet.id,
          ownerId: wallet.ownerId,
          agentId: wallet.agentId,
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

export function getPublicWalletsForAgent(agentId) {
  return listPublicWallets({ agentId });
}
