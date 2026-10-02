import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  registerWallet,
  getWallet
} from "./AfriCryptoWalletRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_DIR = path.resolve(__dirname, "../../../.africrypto/state");

function normalizeLegacyState(state) {
  if (!state.network || !state.address) {
    return [];
  }

  const networkId =
    state.network === "SEPOLIA"
      ? "ETHEREUM_SEPOLIA"
      : state.network;

  const environment =
    state.environment ||
    (state.network === "SEPOLIA" ? "TESTNET" : null);

  return [
    {
      networkId,
      networkFamily: state.networkFamily || null,
      environment,
      address: state.address
    }
  ];
}

function normalizeAddresses(state) {
  if (Array.isArray(state.addresses)) {
    return state.addresses
      .filter(address => address?.address)
      .map(address => ({
        networkId: address.networkId || null,
        networkFamily: address.networkFamily || null,
        environment: address.environment || null,
        address: address.address
      }));
  }

  return normalizeLegacyState(state);
}

function walletStatePath(walletId) {
  if (!walletId) {
    throw new Error("AFRICRYPTO_WALLET_ID_REQUIRED");
  }

  return path.join(STATE_DIR, `${walletId}.json`);
}

function readWalletState(walletId) {
  const filePath = walletStatePath(walletId);

  if (!fs.existsSync(filePath)) {
    throw new Error("AFRICRYPTO_WALLET_STATE_NOT_FOUND");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeWalletState(walletId, state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });

  const filePath = walletStatePath(walletId);

  fs.writeFileSync(
    filePath,
    `${JSON.stringify(state, null, 2)}\n`,
    "utf8"
  );

  return state;
}

export function loadWalletState() {
  if (!fs.existsSync(STATE_DIR)) {
    return [];
  }

  const loaded = [];

  for (const file of fs.readdirSync(STATE_DIR)) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(STATE_DIR, file);
    const state = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!state.walletId || !state.ownerId) {
      continue;
    }

    const addresses = normalizeAddresses(state);

    if (!addresses.length) {
      continue;
    }

    const wallet = registerWallet({
      id: state.walletId,
      ownerId: state.ownerId,
      name: state.name || state.purpose || "AfriCrypto Wallet",
      status: state.status || "ACTIVE",
      createdAt: state.createdAt,
      policy: state.policy,
      addresses
    });

    loaded.push(wallet);
  }

  return loaded;
}

export function saveWalletPolicy(walletId, policy) {
  const wallet = getWallet(walletId);

  if (!wallet) {
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  const state = readWalletState(walletId);

  const nextPolicy = {
    enabled: policy?.enabled ?? wallet.policy.enabled,
    sendingEnabled:
      policy?.sendingEnabled ?? wallet.policy.sendingEnabled,
    receivingEnabled:
      policy?.receivingEnabled ?? wallet.policy.receivingEnabled,

    sendLimits: {
      perTransaction:
        policy?.sendLimits && Object.prototype.hasOwnProperty.call(policy.sendLimits, "perTransaction")
          ? policy.sendLimits.perTransaction
          : wallet.policy.sendLimits.perTransaction,

      daily:
        policy?.sendLimits && Object.prototype.hasOwnProperty.call(policy.sendLimits, "daily")
          ? policy.sendLimits.daily
          : wallet.policy.sendLimits.daily
    },

    receiveLimits: {
      perTransaction:
        policy?.receiveLimits && Object.prototype.hasOwnProperty.call(policy.receiveLimits, "perTransaction")
          ? policy.receiveLimits.perTransaction
          : wallet.policy.receiveLimits.perTransaction,

      daily:
        policy?.receiveLimits && Object.prototype.hasOwnProperty.call(policy.receiveLimits, "daily")
          ? policy.receiveLimits.daily
          : wallet.policy.receiveLimits.daily
    }
  };

  const nextState = {
    ...state,
    policy: nextPolicy,
    updatedAt: new Date().toISOString()
  };

  writeWalletState(walletId, nextState);

  const updatedWallet = registerWallet({
    ...wallet,
    policy: nextPolicy
  });

  return updatedWallet;
}
