import test from "node:test";
import assert from "node:assert/strict";

import SettlementRuntime from "../../platform/agent/economy/AfriAgentsEconomySettlementRuntime.js";
import PaymentStore from "../../platform/agent/economy/AfriAgentsEconomyPaymentStore.js";
import { PAYMENTS_ENABLED } from "../../platform/agent/economy/AfriAgentsEconomyPaymentPolicy.js";

const reconciliationTest = PAYMENTS_ENABLED ? test : test.skip;

const SIGNATURE = "1".repeat(64);
const PAYMENT_ID = "TEST-SOLANA-RECONCILIATION";

function makePayment(overrides = {}) {
  return {
    paymentId: PAYMENT_ID,
    status: "SETTLEMENT_UNRESOLVED",
    settlementProvider: "AFRICRYPTO",
    settlementEnvironment: "TESTNET",
    settlementNetwork: "SOLANA_DEVNET",
    transactionHash: SIGNATURE,
    settledAt: null,
    ...overrides
  };
}

function rpcResponse(result) {
  return {
    ok: true,
    json: async () => ({
      jsonrpc: "2.0",
      id: 1,
      result
    })
  };
}

function mockStatus(status) {
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);

    assert.equal(request.method, "getSignatureStatuses");

    return rpcResponse({ value: [status] });
  };
}

reconciliationTest("finalized Solana success confirms an unresolved payment", async () => {
  const originalFetch = globalThis.fetch;
  const originalRpcUrl = process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;

  try {
    process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL =
      "https://solana-rpc.example.invalid";

    mockStatus({
      slot: 123,
      confirmations: null,
      confirmationStatus: "finalized",
      err: null
    });

    PaymentStore.save(makePayment());

    const result = await SettlementRuntime.reconcile(PAYMENT_ID);

    assert.equal(result.status, "CONFIRMED");
    assert.equal(result.transactionHash, SIGNATURE);
    assert.equal(result.settlementReconciliation.outcome, "CONFIRMED");
    assert.equal(result.settlementReconciliation.blockNumber, 123);
    assert.ok(result.settledAt);
  } finally {
    globalThis.fetch = originalFetch;

    if (originalRpcUrl === undefined) {
      delete process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;
    } else {
      process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL = originalRpcUrl;
    }
  }
});

reconciliationTest("finalized Solana failure marks payment failed", async () => {
  const originalFetch = globalThis.fetch;
  const originalRpcUrl = process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;

  try {
    process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL =
      "https://solana-rpc.example.invalid";

    mockStatus({
      slot: 124,
      confirmations: null,
      confirmationStatus: "finalized",
      err: { InstructionError: [0, "Custom"] }
    });

    PaymentStore.save(makePayment());

    const result = await SettlementRuntime.reconcile(PAYMENT_ID);

    assert.equal(result.status, "FAILED");
    assert.equal(
      result.settlementErrorCode,
      "AFRICRYPTO_TRANSACTION_REVERTED"
    );
    assert.equal(result.settledAt, null);
    assert.deepEqual(
      result.settlementReconciliation.transactionError,
      { InstructionError: [0, "Custom"] }
    );
  } finally {
    globalThis.fetch = originalFetch;

    if (originalRpcUrl === undefined) {
      delete process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;
    } else {
      process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL = originalRpcUrl;
    }
  }
});

reconciliationTest("pending Solana transaction stays unresolved", async () => {
  const originalFetch = globalThis.fetch;
  const originalRpcUrl = process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;

  try {
    process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL =
      "https://solana-rpc.example.invalid";

    mockStatus({
      slot: 125,
      confirmations: 2,
      confirmationStatus: "confirmed",
      err: null
    });

    PaymentStore.save(makePayment());

    const result = await SettlementRuntime.reconcile(PAYMENT_ID);

    assert.equal(result.status, "SETTLEMENT_UNRESOLVED");
    assert.equal(result.settlementReconciliation.outcome, "PENDING");
    assert.equal(result.settledAt, null);
  } finally {
    globalThis.fetch = originalFetch;

    if (originalRpcUrl === undefined) {
      delete process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;
    } else {
      process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL = originalRpcUrl;
    }
  }
});

reconciliationTest("unknown Solana transaction stays unresolved", async () => {
  const originalFetch = globalThis.fetch;
  const originalRpcUrl = process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;

  try {
    process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL =
      "https://solana-rpc.example.invalid";

    globalThis.fetch = async (_url, options) => {
      const request = JSON.parse(options.body);

      if (request.method === "getSignatureStatuses") {
        return rpcResponse({ value: [null] });
      }

      assert.equal(request.method, "getTransaction");
      return rpcResponse(null);
    };

    PaymentStore.save(makePayment());

    const result = await SettlementRuntime.reconcile(PAYMENT_ID);

    assert.equal(result.status, "SETTLEMENT_UNRESOLVED");
    assert.equal(result.settlementReconciliation.outcome, "UNKNOWN");
  } finally {
    globalThis.fetch = originalFetch;

    if (originalRpcUrl === undefined) {
      delete process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL;
    } else {
      process.env.AFRICRYPTO_SOLANA_DEVNET_RPC_URL = originalRpcUrl;
    }
  }
});

reconciliationTest("unsupported Bitcoin testnet reconciliation is rejected", async () => {
  PaymentStore.save(makePayment({
    settlementNetwork: "BITCOIN_TESTNET"
  }));

  await assert.rejects(
    SettlementRuntime.reconcile(PAYMENT_ID),
    { message: "AFRI_ECONOMY_RECONCILIATION_NETWORK_UNSUPPORTED" }
  );

  assert.equal(
    PaymentStore.get(PAYMENT_ID).status,
    "SETTLEMENT_UNRESOLVED"
  );
});

reconciliationTest("incomplete reconciliation data is rejected without changing payment", async () => {
  PaymentStore.save(makePayment({ transactionHash: null }));

  await assert.rejects(
    SettlementRuntime.reconcile(PAYMENT_ID),
    { message: "AFRI_ECONOMY_RECONCILIATION_DATA_INCOMPLETE" }
  );

  assert.equal(
    PaymentStore.get(PAYMENT_ID).status,
    "SETTLEMENT_UNRESOLVED"
  );
});
