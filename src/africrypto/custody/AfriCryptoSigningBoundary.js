import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";
import AfriCryptoCustodyCredentialStore from "./AfriCryptoCustodyCredentialStore.js";
import { getWallet } from "../wallets/AfriCryptoWalletRegistry.js";
import { getNetwork } from "../networks/AfriCryptoNetworkRegistry.js";
import { evaluateSendPolicy } from "../policies/AfriCryptoPolicyEngine.js";
import { recordSigningAudit, listSigningAudits } from "./AfriCryptoSigningAuditStore.js";
import { reserveDailyUsage, releaseDailyUsage } from "../policies/AfriCryptoUsageStore.js";

const KEY_DIR = path.resolve(process.cwd(), ".africrypto/keys");

function requireValue(value, code) {
  if (!value) throw new Error(code);
  return value;
}

function getKeystorePath(walletId) {
  return path.join(KEY_DIR, `${walletId}.json`);
}

export async function signEvmTransaction({
  walletId,
  networkId,
  to,
  value = "0",
  data = "0x",
  nonce,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  chainId,
  requestId
} = {}) {
  requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");
  requireValue(networkId, "AFRICRYPTO_NETWORK_ID_REQUIRED");
  requireValue(to, "AFRICRYPTO_DESTINATION_REQUIRED");
  requireValue(requestId, "AFRICRYPTO_REQUEST_ID_REQUIRED");

  if (listSigningAudits().some(entry => entry.requestId === requestId)) {
    throw new Error("AFRICRYPTO_DUPLICATE_REQUEST");
  }

  const auditFailure = (reason, extra = {}) => {
    recordSigningAudit({
      requestId,
      walletId,
      networkId,
      environment: extra.environment || null,
      from: extra.from || null,
      to: to || null,
      value: value ?? null,
      status: "REJECTED",
      reason
    });
  };

  const wallet = getWallet(walletId);
  if (!wallet) {
    auditFailure("WALLET_NOT_FOUND");
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  const network = getNetwork(networkId);
  if (!network) {
    auditFailure("NETWORK_NOT_FOUND");
    throw new Error("AFRICRYPTO_NETWORK_NOT_FOUND");
  }

  if (network.family !== "EVM") {
    auditFailure("SIGNING_NETWORK_UNSUPPORTED", {
      environment: network.environment
    });
    throw new Error("AFRICRYPTO_SIGNING_NETWORK_UNSUPPORTED");
  }

  if (!ethers.isAddress(to)) {
    auditFailure("INVALID_DESTINATION", {
      environment: network.environment
    });
    throw new Error("AFRICRYPTO_INVALID_DESTINATION");
  }

  const amount = ethers.parseEther(String(value));

  const policy = evaluateSendPolicy({
    walletId,
    networkId,
    amount: ethers.formatEther(amount)
  });

  if (!policy.allowed) {
    auditFailure(`POLICY_DENIED:${policy.reason}`, {
      environment: network.environment
    });
    throw new Error(`AFRICRYPTO_SIGNING_POLICY_DENIED:${policy.reason}`);
  }

  let usageReservation = null;

  try {
    usageReservation = reserveDailyUsage(
      walletId,
      networkId,
      ethers.formatEther(amount),
      wallet.policy.sendLimits.daily
    );
  } catch (error) {
    if (error.message === "AFRICRYPTO_USAGE_DAILY_LIMIT_EXCEEDED") {
      auditFailure("POLICY_DENIED:SEND_DAILY_LIMIT_EXCEEDED", {
        environment: network.environment
      });
      throw new Error("AFRICRYPTO_SIGNING_POLICY_DENIED:SEND_DAILY_LIMIT_EXCEEDED");
    }

    auditFailure(`USAGE_RESERVATION_FAILED:${error.message}`, {
      environment: network.environment
    });
    throw error;
  }

  const releaseReservation = () => {
    if (!usageReservation) return;
    const reservation = usageReservation;
    usageReservation = null;
    return releaseDailyUsage(reservation);
  };

  const keystorePath = getKeystorePath(walletId);
  if (!fs.existsSync(keystorePath)) {
    await releaseReservation();
    auditFailure("KEYSTORE_NOT_FOUND", {
      environment: network.environment
    });
    throw new Error("AFRICRYPTO_KEYSTORE_NOT_FOUND");
  }

  const encryptedJson = fs.readFileSync(keystorePath, "utf8");
  const custodyCredential =
    AfriCryptoCustodyCredentialStore.resolve(walletId);

  let signer;
  try {
    signer = await ethers.Wallet.fromEncryptedJson(
      encryptedJson,
      custodyCredential
    );
  } catch (error) {
    await releaseReservation();
    auditFailure("KEYSTORE_DECRYPTION_FAILED", {
      environment: network.environment
    });
    throw error;
  }

  const addressRecord = wallet.addresses.find(
    address =>
      address.networkId === networkId &&
      address.environment === network.environment
  );

  if (!addressRecord) {
    await releaseReservation();
    auditFailure("WALLET_NETWORK_ADDRESS_NOT_FOUND", {
      environment: network.environment,
      from: signer.address
    });
    throw new Error("AFRICRYPTO_WALLET_NETWORK_ADDRESS_NOT_FOUND");
  }

  if (signer.address.toLowerCase() !== addressRecord.address.toLowerCase()) {
    await releaseReservation();
    auditFailure("KEY_ADDRESS_MISMATCH", {
      environment: network.environment,
      from: signer.address
    });
    throw new Error("AFRICRYPTO_KEY_ADDRESS_MISMATCH");
  }

  const unsignedTransaction = {
    to,
    value: amount,
    data,
    nonce,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    chainId
  };

  let signedTransaction;

  try {
    signedTransaction = await signer.signTransaction(unsignedTransaction);
  } catch (error) {
    await releaseReservation();
    auditFailure("TRANSACTION_SIGNING_FAILED", {
      environment: network.environment,
      from: signer.address
    });
    throw error;
  }

  const signedValue = ethers.formatEther(amount);

  recordSigningAudit({
    requestId,
    walletId,
    networkId,
    environment: network.environment,
    from: signer.address,
    to,
    value: signedValue,
    status: "SIGNED"
  });

  return {
    walletId,
    networkId,
    environment: network.environment,
    from: signer.address,
    to,
    value: ethers.formatEther(amount),
    signedTransaction,
    usageReservation
  };
}
