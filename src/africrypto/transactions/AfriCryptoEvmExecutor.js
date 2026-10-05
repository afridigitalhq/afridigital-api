import { ethers } from "ethers";
import { getNetwork } from "../networks/AfriCryptoNetworkRegistry.js";
import { getWallet, getWalletAddress } from "../wallets/AfriCryptoWalletRegistry.js";
import { signEvmTransaction } from "../custody/AfriCryptoSigningBoundary.js";
import { releaseDailyUsage } from "../policies/AfriCryptoUsageStore.js";
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
    if (signed.usageReservation) {
      await releaseDailyUsage(signed.usageReservation);
    }
    throw error;
  }

  const receipt = await response.wait(confirmations);

  return {
    type: AFRI_CRYPTO_TRANSACTION_TYPES.TRANSFER,
    status: receipt?.status === 1
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
