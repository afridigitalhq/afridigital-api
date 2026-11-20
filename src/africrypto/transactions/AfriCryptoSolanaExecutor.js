import { getNetwork } from "../networks/AfriCryptoNetworkRegistry.js";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function isValidSignature(signature) {
  if (typeof signature !== "string" || !signature.length) return false;

  let value = 0n;

  for (const char of signature) {
    const digit = BASE58.indexOf(char);
    if (digit < 0) return false;
    value = value * 58n + BigInt(digit);
  }

  let decodedBytes = 0;

  while (value > 0n) {
    decodedBytes++;
    value >>= 8n;
  }

  const leadingZeroBytes = signature.match(/^1*/)?.[0].length ?? 0;

  return decodedBytes + leadingZeroBytes === 64;
}

function getRpcUrl(networkId) {
  const envNames = {
    SOLANA_DEVNET: "AFRICRYPTO_SOLANA_DEVNET_RPC_URL"
  };

  const envName = envNames[networkId];

  if (!envName) {
    throw new Error("AFRICRYPTO_SOLANA_RPC_UNCONFIGURED");
  }

  const url = process.env[envName];

  if (!url) {
    throw new Error(`AFRICRYPTO_RPC_URL_MISSING:${envName}`);
  }

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("AFRICRYPTO_SOLANA_RPC_URL_INVALID");
  }

  const isLocalHttp =
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsed.hostname);

  if (parsed.protocol !== "https:" && !isLocalHttp) {
    throw new Error("AFRICRYPTO_SOLANA_RPC_URL_INVALID");
  }

  return url;
}

async function rpcRequest(url, method, params, fetchImpl) {
  let response;

  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params
      })
    });

    if (!response?.ok) {
      throw new Error("HTTP_ERROR");
    }

    const payload = await response.json();

    if (
      !payload ||
      payload.jsonrpc !== "2.0" ||
      payload.id !== 1 ||
      payload.error ||
      !Object.prototype.hasOwnProperty.call(payload, "result")
    ) {
      throw new Error("INVALID_RPC_RESPONSE");
    }

    return payload.result;
  } catch {
    throw new Error("AFRICRYPTO_SOLANA_RPC_REQUEST_FAILED");
  }
}

/**
 * Read-only inspection. A disabled network may be inspected, but this
 * function never enables it, signs a transaction, or broadcasts anything.
 */
export async function inspectSolanaTransaction({
  networkId,
  transactionSignature,
  fetchImpl = globalThis.fetch
} = {}) {
  if (!networkId) {
    throw new Error("AFRICRYPTO_NETWORK_ID_REQUIRED");
  }

  if (!transactionSignature) {
    throw new Error("AFRICRYPTO_TRANSACTION_HASH_REQUIRED");
  }

  if (!isValidSignature(transactionSignature)) {
    throw new Error("AFRICRYPTO_SOLANA_SIGNATURE_INVALID");
  }

  if (typeof fetchImpl !== "function") {
    throw new Error("AFRICRYPTO_SOLANA_FETCH_UNAVAILABLE");
  }

  const network = getNetwork(networkId);

  if (
    !network ||
    network.family !== "SOLANA" ||
    network.adapter !== "SOLANA" ||
    network.environment !== "TESTNET"
  ) {
    throw new Error("AFRICRYPTO_SOLANA_INSPECTION_NETWORK_UNSUPPORTED");
  }

  const url = getRpcUrl(networkId);

  const statusResult = await rpcRequest(
    url,
    "getSignatureStatuses",
    [[transactionSignature], { searchTransactionHistory: true }],
    fetchImpl
  );

  const status = statusResult?.value?.[0];

  if (status) {
    const slot = Number.isSafeInteger(status.slot) && status.slot >= 0
      ? status.slot
      : null;

    const confirmations = Number.isSafeInteger(status.confirmations) &&
      status.confirmations >= 0
      ? status.confirmations
      : status.confirmationStatus === "finalized" ? 1 : 0;

    let outcome = "UNKNOWN";

    if (status.confirmationStatus === "finalized") {
      outcome = status.err == null ? "CONFIRMED" : "REVERTED";
    } else if (
      status.confirmationStatus === "processed" ||
      status.confirmationStatus === "confirmed"
    ) {
      outcome = "PENDING";
    }

    return {
      networkId,
      transactionSignature,
      outcome,
      blockNumber: slot,
      confirmations,
      transactionError: status.err ?? null
    };
  }

  const transaction = await rpcRequest(
    url,
    "getTransaction",
    [
      transactionSignature,
      {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
      }
    ],
    fetchImpl
  );

  return {
    networkId,
    transactionSignature,
    outcome: transaction ? "PENDING" : "UNKNOWN",
    blockNumber: Number.isSafeInteger(transaction?.slot)
      ? transaction.slot
      : null,
    confirmations: 0,
    transactionError: transaction?.meta?.err ?? null
  };
}
