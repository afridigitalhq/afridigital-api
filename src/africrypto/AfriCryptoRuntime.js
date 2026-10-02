import { loadWalletState } from "./wallets/AfriCryptoWalletStateStore.js";
import { listWallets } from "./wallets/AfriCryptoWalletRegistry.js";

let initialized = false;

export function initializeAfriCrypto() {
  if (initialized) {
    return {
      initialized: true,
      loaded: listWallets().length,
      wallets: listWallets()
    };
  }

  const loaded = loadWalletState();
  initialized = true;

  return {
    initialized: true,
    loaded: loaded.length,
    wallets: listWallets()
  };
}

export function isAfriCryptoInitialized() {
  return initialized;
}
