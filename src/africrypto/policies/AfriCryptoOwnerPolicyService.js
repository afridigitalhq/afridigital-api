import fs from "node:fs";
import path from "node:path";
import { getWallet } from "../wallets/AfriCryptoWalletRegistry.js";
import { saveWalletPolicy } from "../wallets/AfriCryptoWalletStateStore.js";
import { authorizeWalletOwner } from "./AfriCryptoOwnerAuthorization.js";

const AUDIT_DIR = path.resolve(process.cwd(), ".africrypto/audit");
const POLICY_AUDIT_FILE = path.join(AUDIT_DIR, "policy.jsonl");

function ensureAuditDir() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true, mode: 0o700 });
}

function audit(entry) {
  ensureAuditDir();
  fs.appendFileSync(
    POLICY_AUDIT_FILE,
    `${JSON.stringify({
      action: entry.action,
      walletId: entry.walletId,
      ownerId: entry.ownerId,
      createdAt: new Date().toISOString()
    })}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

function requireOwner(walletId, authenticatedOwnerId) {
  authorizeWalletOwner({
    walletId,
    authenticatedOwnerId
  });

  return getWallet(walletId);
}

export function setWalletLimits({
  walletId,
  authenticatedOwnerId,
  sendLimits,
  receiveLimits
} = {}) {
  const wallet = requireOwner(walletId, authenticatedOwnerId);

  const policy = {
    ...wallet.policy,
    sendLimits: {
      perTransaction: sendLimits?.perTransaction ?? null,
      daily: sendLimits?.daily ?? null
    },
    receiveLimits: {
      perTransaction: receiveLimits?.perTransaction ?? null,
      daily: receiveLimits?.daily ?? null
    }
  };

  const updated = saveWalletPolicy(walletId, policy);

  audit({
    action: "POLICY_LIMITS_UPDATED",
    walletId,
    ownerId: authenticatedOwnerId
  });

  return updated;
}

export function resetWalletLimits({
  walletId,
  authenticatedOwnerId
} = {}) {
  const wallet = requireOwner(walletId, authenticatedOwnerId);

  const policy = {
    ...wallet.policy,
    sendLimits: {
      perTransaction: null,
      daily: null
    },
    receiveLimits: {
      perTransaction: null,
      daily: null
    }
  };

  const updated = saveWalletPolicy(walletId, policy);

  audit({
    action: "POLICY_LIMITS_RESET",
    walletId,
    ownerId: authenticatedOwnerId
  });

  return updated;
}

export function setWalletDirection({
  walletId,
  authenticatedOwnerId,
  sendingEnabled,
  receivingEnabled
} = {}) {
  const wallet = requireOwner(walletId, authenticatedOwnerId);

  const policy = {
    ...wallet.policy,
    sendingEnabled: Boolean(sendingEnabled),
    receivingEnabled: Boolean(receivingEnabled)
  };

  const updated = saveWalletPolicy(walletId, policy);

  audit({
    action: "POLICY_DIRECTION_UPDATED",
    walletId,
    ownerId: authenticatedOwnerId
  });

  return updated;
}
