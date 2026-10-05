import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";
import {
  AFRI_CRYPTO_CUSTODY_MODES
} from "./AfriCryptoCustodyContract.js";
import AfriCryptoCustodyCredentialStore from "./AfriCryptoCustodyCredentialStore.js";

const KEY_DIR = path.resolve(process.cwd(), ".africrypto/keys");
const STATE_DIR = path.resolve(process.cwd(), ".africrypto/state");

function requireValue(value, code) {
  if (!value) throw new Error(code);
  return value;
}

function normalizeEnvironment(environment) {
  const value = String(environment || "").toUpperCase();

  if (!["MAINNET", "TESTNET"].includes(value)) {
    throw new Error("AFRICRYPTO_INVALID_ENVIRONMENT");
  }

  return value;
}

function networkForEnvironment(networkId, environment) {
  if (environment === "MAINNET" && networkId !== "ETHEREUM") {
    throw new Error("AFRICRYPTO_UNSUPPORTED_MAINNET_NETWORK");
  }

  if (environment === "TESTNET" && networkId !== "ETHEREUM_SEPOLIA") {
    throw new Error("AFRICRYPTO_UNSUPPORTED_TESTNET_NETWORK");
  }

  return networkId;
}

export async function provisionEvmWallet({
  walletId,
  ownerId,
  agentId,
  purpose,
  networkId,
  environment,
  custodyMode = AFRI_CRYPTO_CUSTODY_MODES.MANAGED_CUSTODY,
  custodyCredential
} = {}) {
  requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");
  requireValue(ownerId, "AFRICRYPTO_WALLET_OWNER_REQUIRED");
  requireValue(agentId, "AFRICRYPTO_WALLET_AGENT_REQUIRED");
  requireValue(purpose, "AFRICRYPTO_WALLET_PURPOSE_REQUIRED");
  requireValue(custodyCredential, "AFRICRYPTO_CUSTODY_CREDENTIAL_REQUIRED");

  if (custodyMode !== AFRI_CRYPTO_CUSTODY_MODES.MANAGED_CUSTODY) {
    throw new Error("AFRICRYPTO_PROVISIONER_REQUIRES_MANAGED_CUSTODY");
  }

  const normalizedEnvironment = normalizeEnvironment(environment);
  const normalizedNetwork = networkForEnvironment(
    networkId,
    normalizedEnvironment
  );

  fs.mkdirSync(KEY_DIR, { recursive: true, mode: 0o700 });
  fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });

  const keystorePath = path.join(KEY_DIR, `${walletId}.json`);
  const statePath = path.join(STATE_DIR, `${walletId}.json`);

  if (fs.existsSync(keystorePath) || fs.existsSync(statePath)) {
    throw new Error("AFRICRYPTO_WALLET_ALREADY_PROVISIONED");
  }

  const wallet = ethers.Wallet.createRandom();

  const encryptedJson = await wallet.encrypt(custodyCredential);

  const createdAt = new Date().toISOString();

  try {
    fs.writeFileSync(
      keystorePath,
      `${encryptedJson}\n`,
      {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx"
      }
    );
  } catch (error) {
    throw error;
  }

  const state = {
    walletId,
    ownerId,
    agentId,
    purpose,
    custodyMode,
    networkFamily: "EVM",
    addresses: [
      {
        networkId: normalizedNetwork,
        networkFamily: "EVM",
        environment: normalizedEnvironment,
        address: wallet.address
      }
    ],
    keystore: `.africrypto/keys/${walletId}.json`,
    status: "ACTIVE",
    createdAt,
    updatedAt: createdAt
  };

  let credentialProvisioned = false;

  try {
    AfriCryptoCustodyCredentialStore.provision(
      walletId,
      custodyCredential
    );
    credentialProvisioned = true;

    fs.writeFileSync(
      statePath,
      `${JSON.stringify(state, null, 2)}\n`,
      {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx"
      }
    );
  } catch (error) {
    try {
      fs.unlinkSync(keystorePath);
    } catch {}

    if (credentialProvisioned) {
      try {
        AfriCryptoCustodyCredentialStore.remove(walletId);
      } catch {}
    }

    throw error;
  }

  return {
    walletId,
    ownerId,
    agentId,
    custodyMode,
    networkId: normalizedNetwork,
    environment: normalizedEnvironment,
    address: wallet.address,
    keystore: state.keystore,
    status: state.status
  };
}
