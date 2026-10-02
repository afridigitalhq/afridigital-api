import { ethers } from "ethers";
import {
  registerWallet,
  getWallet,
  listWallets
} from "./AfriCryptoWalletRegistry.js";

const walletSecrets = new Map();

export function createWallet({
  id,
  ownerId,
  name = "AfriCrypto Wallet"
} = {}) {
  if (!id) throw new Error("AFRICRYPTO_WALLET_ID_REQUIRED");
  if (!ownerId) throw new Error("AFRICRYPTO_WALLET_OWNER_REQUIRED");

  if (getWallet(id)) {
    throw new Error("AFRICRYPTO_WALLET_ALREADY_EXISTS");
  }

  const wallet = ethers.Wallet.createRandom();

  const record = registerWallet({
    id,
    ownerId,
    name,
    addresses: [
      {
        networkFamily: "EVM",
        address: wallet.address
      }
    ]
  });

  walletSecrets.set(id, {
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || null
  });

  return {
    id: record.id,
    ownerId: record.ownerId,
    name: record.name,
    addresses: record.addresses,
    status: record.status,
    createdAt: record.createdAt
  };
}

export function getWalletAddress(id, networkFamily = "EVM") {
  const wallet = getWallet(id);

  if (!wallet) {
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  return wallet.addresses.find(
    address => address.networkFamily === networkFamily
  ) || null;
}

export function listWalletSummaries() {
  return listWallets().map(wallet => ({
    id: wallet.id,
    ownerId: wallet.ownerId,
    name: wallet.name,
    addresses: wallet.addresses,
    status: wallet.status,
    createdAt: wallet.createdAt
  }));
}

export function hasWalletSecret(id) {
  return walletSecrets.has(id);
}
