import { ethers } from "ethers";
import { getNetwork } from "../networks/AfriCryptoNetworkRegistry.js";
import { getWallet, getWalletAddress } from "../wallets/AfriCryptoWalletRegistry.js";
import { signEvmTransaction } from "../custody/AfriCryptoSigningBoundary.js";
import {
  AFRI_CRYPTO_TRANSACTION_TYPES,
  AFRI_CRYPTO_TRANSACTION_STATUS
} from "./AfriCryptoTransactionTypes.js";

function requireValue(value, code) {
  if (!value) throw new Error(code);
  return value;
}

function getRpcEnvName(networkId) {
  const map = {
    ETHEREUM_SEPOLIA: "AFRICRYPTO_ETHEREUM_SEPOLIA_RPC_URL",
    ETHEREUM: "AFRICRYPTO_ETHEREUM_MAINNET_RPC_URL"
  };

  return map[networkId] || null;
}

function getRpcUrl(networkId) {
  const envName = getRpcEnvName(networkId);

  if (!envName) {
    throw new Error("AFRICRYPTO_EVM_RPC_UNCONFIGURED");
  }

  const url = process.env[envName];

  if (!url) {
    throw new Error(`AFRICRYPTO_RPC_URL_MISSING:${envName}`);
  }

  return url;
}

export async function inspectEvmTransaction({
  networkId,
  transactionHash
} = {}) {
  requireValue(networkId, "AFRICRYPTO_NETWORK_ID_REQUIRED");
  requireValue(transactionHash, "AFRICRYPTO_TRANSACTION_HASH_REQUIRED");

  if (!ethers.isHexString(transactionHash, 32)) {
    throw new Error("AFRICRYPTO_TRANSACTION_HASH_INVALID");
  }

  const network = getNetwork(networkId);

  if (
    !network ||
    network.family !== "EVM" ||
    network.environment !== "TESTNET" ||
    !network.enabled ||
    !network.chainId
  ) {
    throw new Error("AFRICRYPTO_INSPECTION_NETWORK_UNSUPPORTED");
  }

  const provider = new ethers.JsonRpcProvider(
    getRpcUrl(networkId),
    network.chainId,
    { staticNetwork: true }
  );

  try {
    const rpcNetwork = await provider.getNetwork();

    if (rpcNetwork.chainId !== BigInt(network.chainId)) {
      throw new Error("AFRICRYPTO_RPC_CHAIN_ID_MISMATCH");
    }

    const [receipt, transaction] = await Promise.all([
      provider.getTransactionReceipt(transactionHash),
      provider.getTransaction(transactionHash)
    ]);

    if (
      receipt?.hash &&
      receipt.hash.toLowerCase() !== transactionHash.toLowerCase()
    ) {
      throw new Error("AFRICRYPTO_RECEIPT_HASH_MISMATCH");
    }

    if (receipt) {
      if (
        !Number.isSafeInteger(receipt.blockNumber) ||
        receipt.blockNumber < 0
      ) {
        return {
          outcome: "UNKNOWN",
          networkId,
          transactionHash,
          blockNumber: null,
          confirmations: 0
        };
      }

      const receiptStatus = receipt.status;
      const confirmed = [1, 1n, "1", "0x1"].includes(receiptStatus);
      const reverted = [0, 0n, "0", "0x0"].includes(receiptStatus);

      if (!confirmed && !reverted) {
        return {
          outcome: "UNKNOWN",
          networkId,
          transactionHash,
          blockNumber: receipt.blockNumber ?? null,
          confirmations: 0
        };
      }

      const latestBlock = await provider.getBlockNumber();
      const confirmations = Math.max(
        0,
        latestBlock - receipt.blockNumber + 1
      );

      return {
        outcome: confirmed ? "CONFIRMED" : "REVERTED",
        networkId,
        transactionHash,
        blockNumber: receipt.blockNumber ?? null,
        confirmations
      };
    }

    return {
      outcome: transaction ? "PENDING" : "UNKNOWN",
      networkId,
      transactionHash,
      blockNumber: null,
      confirmations: 0
    };
  } finally {
    provider.destroy();
  }
}

export async function executeEvmTransfer({
  walletId,
  networkId,
  to,
  value = "0",
  data = "0x",
  requestId,
  confirmations = 1
} = {}) {
  requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");
  requireValue(networkId, "AFRICRYPTO_NETWORK_ID_REQUIRED");
  requireValue(to, "AFRICRYPTO_DESTINATION_REQUIRED");
  requireValue(requestId, "AFRICRYPTO_REQUEST_ID_REQUIRED");

  const network = getNetwork(networkId);

  if (!network) {
    throw new Error("AFRICRYPTO_NETWORK_NOT_FOUND");
  }

  if (network.family !== "EVM") {
    throw new Error("AFRICRYPTO_EXECUTION_NETWORK_UNSUPPORTED");
  }

  if (!network.enabled) {
    throw new Error("AFRICRYPTO_NETWORK_DISABLED");
  }

  if (!network.transfersEnabled) {
    throw new Error("AFRICRYPTO_NETWORK_TRANSFERS_DISABLED");
  }

  const wallet = getWallet(walletId);

  if (!wallet) {
    throw new Error("AFRICRYPTO_WALLET_NOT_FOUND");
  }

  if (wallet.status !== "ACTIVE") {
    throw new Error("AFRICRYPTO_WALLET_INACTIVE");
  }

  const sourceAddress = getWalletAddress(
    walletId,
    networkId,
    network.environment
  );

  if (!sourceAddress?.address) {
    throw new Error("AFRICRYPTO_WALLET_NETWORK_ADDRESS_NOT_FOUND");
  }

  const provider = new ethers.JsonRpcProvider(
    getRpcUrl(networkId),
    network.chainId,
    { staticNetwork: true }
  );

  const rpcNetwork = await provider.getNetwork();

  if (rpcNetwork.chainId !== BigInt(network.chainId)) {
    throw new Error("AFRICRYPTO_RPC_CHAIN_ID_MISMATCH");
  }

  const amount = ethers.parseEther(String(value));

  const [nonce, feeData, gasLimit] = await Promise.all([
    provider.getTransactionCount(sourceAddress.address, "pending"),
    provider.getFeeData(),
    provider.estimateGas({
      from: sourceAddress.address,
      to,
      value: amount,
      data
    })
  ]);

  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas ?? 0n;

  if (maxFeePerGas === null) {
    throw new Error("AFRICRYPTO_RPC_FEE_DATA_UNAVAILABLE");
  }

  const signed = await signEvmTransaction({
    walletId,
    networkId,
    to,
    value: ethers.formatEther(amount),
    data,
    nonce,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    chainId: network.chainId,
    requestId
  });

  let response;

  try {
    response = await provider.broadcastTransaction(
      signed.signedTransaction
    );
  } catch (error) {
    const unresolved = new Error("AFRICRYPTO_BROADCAST_OUTCOME_UNRESOLVED");
    unresolved.code = "AFRICRYPTO_BROADCAST_OUTCOME_UNRESOLVED";
    unresolved.transactionHash = ethers.keccak256(signed.signedTransaction);
    unresolved.cause = error;
    throw unresolved;
  }

  let receipt;
  try {
    receipt = await response.wait(confirmations);
  } catch (error) {
    const reverted = [
      0,
      0n,
      "0",
      "0x0"
    ].includes(error?.receipt?.status);

    const code = reverted
      ? "AFRICRYPTO_TRANSACTION_REVERTED"
      : "AFRICRYPTO_RECEIPT_UNRESOLVED";

    const annotated = new Error(code);
    annotated.code = code;
    annotated.transactionHash = response.hash;
    annotated.receipt = error?.receipt ?? null;
    annotated.cause = error;
    throw annotated;
  }

  const receiptStatus = receipt?.status;
  const confirmed = [1, 1n, "1", "0x1"].includes(receiptStatus);
  const reverted = [0, 0n, "0", "0x0"].includes(receiptStatus);

  if (!confirmed && !reverted) {
    const unresolved = new Error("AFRICRYPTO_RECEIPT_UNRESOLVED");
    unresolved.code = "AFRICRYPTO_RECEIPT_UNRESOLVED";
    unresolved.transactionHash = response.hash;
    unresolved.receipt = receipt ?? null;
    throw unresolved;
  }

  return {
    type: AFRI_CRYPTO_TRANSACTION_TYPES.TRANSFER,
    status: confirmed
      ? AFRI_CRYPTO_TRANSACTION_STATUS.CONFIRMED
      : AFRI_CRYPTO_TRANSACTION_STATUS.FAILED,
    walletId,
    networkId,
    environment: network.environment,
    from: signed.from,
    to: signed.to,
    value: signed.value,
    transactionHash: response.hash,
    blockNumber: receipt?.blockNumber ?? null,
    confirmations,
    nonce,
    gasLimit: gasLimit.toString(),
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    chainId: network.chainId
  };
}
