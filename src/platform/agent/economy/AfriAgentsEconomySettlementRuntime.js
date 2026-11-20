import AfriAgentsEconomyPaymentStore from "./AfriAgentsEconomyPaymentStore.js";
import { assertPaymentsEnabled } from "./AfriAgentsEconomyPaymentPolicy.js";
import {
  getWalletByAgentId,
  getWalletAddress
} from "../../../africrypto/wallets/AfriCryptoWalletRegistry.js";
import { getNetwork } from "../../../africrypto/networks/AfriCryptoNetworkRegistry.js";
import { executeEvmTransfer } from "../../../africrypto/transactions/AfriCryptoEvmExecutor.js";
import { inspectEvmTransaction } from "../../../africrypto/transactions/AfriCryptoEvmExecutor.js";
import { inspectSolanaTransaction } from "../../../africrypto/transactions/AfriCryptoSolanaExecutor.js";

function requireText(value, code) {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(code);
  }

  return value.trim();
}

function normalizeAmount(value) {
  const amount = String(value ?? "").trim();

  if (!amount || !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(amount)) {
    throw new Error("AFRI_ECONOMY_SETTLEMENT_AMOUNT_REQUIRED");
  }

  return amount;
}

const AfriAgentsEconomySettlementRuntime = {
  async reconcile(paymentId) {
    assertPaymentsEnabled("reconcile");
    requireText(paymentId, "AFRI_ECONOMY_PAYMENT_ID_REQUIRED");

    const payment = AfriAgentsEconomyPaymentStore.get(paymentId);

    if (!payment) {
      throw new Error("AFRI_ECONOMY_PAYMENT_NOT_FOUND");
    }

    if (payment.status !== "SETTLEMENT_UNRESOLVED") {
      throw new Error("AFRI_ECONOMY_PAYMENT_NOT_UNRESOLVED");
    }

    if (
      payment.settlementProvider !== "AFRICRYPTO" ||
      payment.settlementEnvironment !== "TESTNET" ||
      !payment.settlementNetwork ||
      !payment.transactionHash
    ) {
      throw new Error("AFRI_ECONOMY_RECONCILIATION_DATA_INCOMPLETE");
    }

    const network = getNetwork(payment.settlementNetwork);

    if (
      !network ||
      network.environment !== "TESTNET" ||
      !["EVM", "SOLANA"].includes(network.family) ||
      network.adapter !== network.family
    ) {
      throw new Error("AFRI_ECONOMY_RECONCILIATION_NETWORK_UNSUPPORTED");
    }

    const isEvm = network.family === "EVM";

    const inspection = isEvm
      ? await inspectEvmTransaction({
          networkId: payment.settlementNetwork,
          transactionHash: payment.transactionHash
        })
      : await inspectSolanaTransaction({
          networkId: payment.settlementNetwork,
          transactionSignature: payment.transactionHash
        });

    const inspectedReference = isEvm
      ? inspection.transactionHash
      : inspection.transactionSignature;

    const referenceMatches =
      typeof inspectedReference === "string" &&
      (isEvm
        ? inspectedReference.toLowerCase() === payment.transactionHash.toLowerCase()
        : inspectedReference === payment.transactionHash);

    if (!referenceMatches) {
      throw new Error("AFRI_ECONOMY_RECONCILIATION_HASH_MISMATCH");
    }

    const checkedAt = Date.now();
    const reconciliation = {
      checkedAt,
      outcome: inspection.outcome,
      blockNumber: inspection.blockNumber ?? null,
      confirmations: inspection.confirmations ?? 0,
      ...(isEvm ? {} : {
        transactionError: inspection.transactionError ?? null
      })
    };

    const sufficientlyFinal = isEvm
      ? inspection.confirmations >= 1
      : ["CONFIRMED", "REVERTED"].includes(inspection.outcome);

    if (inspection.outcome === "CONFIRMED" && sufficientlyFinal) {
      return AfriAgentsEconomyPaymentStore.save({
        ...payment,
        status: "CONFIRMED",
        transactionHash: inspectedReference,
        settledAt: checkedAt,
        settlementErrorCode: null,
        settlementReconciliation: reconciliation
      });
    }

    if (inspection.outcome === "REVERTED" && sufficientlyFinal) {
      return AfriAgentsEconomyPaymentStore.save({
        ...payment,
        status: "FAILED",
        transactionHash: inspectedReference,
        settledAt: null,
        settlementErrorCode: "AFRICRYPTO_TRANSACTION_REVERTED",
        settlementReconciliation: reconciliation
      });
    }

    return AfriAgentsEconomyPaymentStore.save({
      ...payment,
      status: "SETTLEMENT_UNRESOLVED",
      settledAt: null,
      settlementReconciliation: reconciliation
    });
  },

  async settle({
    paymentId,
    settlement
  } = {}) {
    assertPaymentsEnabled("settle");
    requireText(
      paymentId,
      "AFRI_ECONOMY_PAYMENT_ID_REQUIRED"
    );

    if (!settlement || typeof settlement !== "object") {
      throw new Error("AFRI_ECONOMY_SETTLEMENT_REQUIRED");
    }

    const payment =
      AfriAgentsEconomyPaymentStore.get(paymentId);

    if (!payment) {
      throw new Error("AFRI_ECONOMY_PAYMENT_NOT_FOUND");
    }

    if (payment.status !== "READY_FOR_SETTLEMENT") {
      if (
        payment.status === "CONFIRMED" ||
        payment.status === "NO_SETTLEMENT_REQUIRED"
      ) {
        return payment;
      }

      throw new Error(
        "AFRI_ECONOMY_PAYMENT_NOT_READY_FOR_SETTLEMENT"
      );
    }

    const provider = requireText(
      settlement.provider,
      "AFRI_ECONOMY_SETTLEMENT_PROVIDER_REQUIRED"
    );

    if (provider !== "AFRICRYPTO") {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PROVIDER_UNSUPPORTED"
      );
    }

    const networkId = requireText(
      settlement.networkId,
      "AFRI_ECONOMY_SETTLEMENT_NETWORK_REQUIRED"
    );

    const asset = requireText(
      settlement.asset,
      "AFRI_ECONOMY_SETTLEMENT_ASSET_REQUIRED"
    ).toUpperCase();

    const amount = normalizeAmount(
      settlement.amount
    );

    const network = getNetwork(networkId);

    if (!network) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_NETWORK_NOT_FOUND"
      );
    }

    if (network.environment !== "TESTNET") {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_TESTNET_ONLY"
      );
    }

    if (network.family !== "EVM" || network.adapter !== "EVM") {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_NETWORK_ADAPTER_UNSUPPORTED"
      );
    }

    if (network.enabled !== true || network.transfersEnabled !== true) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_NETWORK_DISABLED"
      );
    }

    if (asset !== network.nativeAsset) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_ASSET_MISMATCH"
      );
    }

    const payerWallet =
      getWalletByAgentId(payment.payerAgentId);

    if (!payerWallet) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PAYER_WALLET_NOT_FOUND"
      );
    }

    const payeeWallet =
      getWalletByAgentId(payment.payeeAgentId);

    if (!payeeWallet) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PAYEE_WALLET_NOT_FOUND"
      );
    }

    if (payerWallet.status !== "ACTIVE") {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PAYER_WALLET_INACTIVE"
      );
    }

    if (payeeWallet.status !== "ACTIVE") {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PAYEE_WALLET_INACTIVE"
      );
    }

    const destination =
      getWalletAddress(
        payeeWallet.id,
        networkId,
        network.environment
      );

    if (!destination?.address) {
      throw new Error(
        "AFRI_ECONOMY_SETTLEMENT_PAYEE_ADDRESS_NOT_FOUND"
      );
    }

    const settlementRequestId =
      `SETTLEMENT-${payment.paymentId}`;

    const startedAt = Date.now();

    const updatedStarted =
      AfriAgentsEconomyPaymentStore.save({
        ...payment,
        settlementProvider: provider,
        settlementNetwork: networkId,
        settlementEnvironment: network.environment,
        settlementStartedAt: startedAt
      });

    try {
      const result = await executeEvmTransfer({
        walletId: payerWallet.id,
        networkId,
        to: destination.address,
        value: amount,
        requestId: settlementRequestId,
        confirmations: 1
      });

      const settledAt = Date.now();

      return AfriAgentsEconomyPaymentStore.save({
        ...updatedStarted,
        status: result.status,
        transactionHash: result.transactionHash,
        settledAt,
        settlementAmount: amount,
        settlementAsset: asset
      });
    } catch (error) {
      const unresolved = [
        "AFRICRYPTO_BROADCAST_OUTCOME_UNRESOLVED",
        "AFRICRYPTO_RECEIPT_UNRESOLVED"
      ].includes(error?.code);

      AfriAgentsEconomyPaymentStore.save({
        ...updatedStarted,
        status: unresolved ? "SETTLEMENT_UNRESOLVED" : "FAILED",
        transactionHash: error?.transactionHash || updatedStarted.transactionHash || null,
        settledAt: null,
        settlementAmount: amount,
        settlementAsset: asset,
        settlementErrorCode: error?.code || "AFRI_ECONOMY_SETTLEMENT_FAILED"
      });

      throw error;
    }
  }
};

export default AfriAgentsEconomySettlementRuntime;
