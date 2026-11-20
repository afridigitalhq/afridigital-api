import test from "node:test";
import assert from "node:assert/strict";
import { inspectSolanaTransaction } from "./AfriCryptoSolanaExecutor.js";

const networkId = "SOLANA_DEVNET";
const signature = "1".repeat(64);
const envName = "AFRICRYPTO_SOLANA_DEVNET_RPC_URL";

function response(result) {
  return new Response(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    result
  }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}

function mockFetch(results) {
  const calls = [];

  const fetchImpl = async (_url, options) => {
    const request = JSON.parse(options.body);
    calls.push(request);

    const next = results.shift();

    if (next instanceof Error) throw next;
    if (next instanceof Response) return next;

    return response(next);
  };

  return { fetchImpl, calls };
}

async function withRpcUrl(fn) {
  const previous = process.env[envName];
  process.env[envName] = "https://solana-rpc.invalid";

  try {
    await fn();
  } finally {
    if (previous === undefined) delete process.env[envName];
    else process.env[envName] = previous;
  }
}

test("confirmed transaction is reported without changing its signature", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([{
      context: { slot: 123 },
      value: [{
        slot: 123,
        confirmations: 2,
        confirmationStatus: "finalized",
        err: null
      }]
    }]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "CONFIRMED");
    assert.equal(result.confirmations, 2);
    assert.equal(result.transactionSignature, signature);
    assert.equal(mock.calls.length, 1);
    assert.equal(mock.calls[0].method, "getSignatureStatuses");
  });
});

test("confirmed transaction error is reported as reverted", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([{
      context: { slot: 124 },
      value: [{
        slot: 124,
        confirmations: 1,
        confirmationStatus: "finalized",
        err: { InstructionError: [0, "Custom"] }
      }]
    }]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "REVERTED");
    assert.notEqual(result.transactionError, null);
  });
});

test("processed transaction remains pending", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([{
      context: { slot: 125 },
      value: [{
        slot: 125,
        confirmations: 0,
        confirmationStatus: "processed",
        err: null
      }]
    }]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "PENDING");
  });
});

test("missing status and missing transaction return unknown", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([
      { context: { slot: 0 }, value: [null] },
      null
    ]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "UNKNOWN");
    assert.equal(mock.calls.length, 2);
    assert.equal(mock.calls[1].method, "getTransaction");
  });
});

test("transaction found without a status remains pending", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([
      { context: { slot: 0 }, value: [null] },
      { slot: 126, meta: { err: null } }
    ]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "PENDING");
    assert.equal(result.blockNumber, 126);
  });
});

test("invalid signature is rejected before RPC", async () => {
  await assert.rejects(
    inspectSolanaTransaction({
      networkId,
      transactionSignature: "not-a-signature",
      fetchImpl: async () => {
        throw new Error("RPC MUST NOT BE CALLED");
      }
    }),
    { message: "AFRICRYPTO_SOLANA_SIGNATURE_INVALID" }
  );
});

test("RPC failures are normalized without exposing endpoint details", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([new Error("simulated failure")]);

    await assert.rejects(
      inspectSolanaTransaction({
        networkId,
        transactionSignature: signature,
        fetchImpl: mock.fetchImpl
      }),
      { message: "AFRICRYPTO_SOLANA_RPC_REQUEST_FAILED" }
    );
  });
});

test("mainnet Solana inspection is rejected", async () => {
  await assert.rejects(
    inspectSolanaTransaction({
      networkId: "SOLANA",
      transactionSignature: signature,
      fetchImpl: async () => {
        throw new Error("RPC MUST NOT BE CALLED");
      }
    }),
    { message: "AFRICRYPTO_SOLANA_INSPECTION_NETWORK_UNSUPPORTED" }
  );
});

test("remote plain HTTP RPC URL is rejected before network access", async () => {
  const previous = process.env[envName];
  process.env[envName] = "http://rpc.example.invalid";
  let called = false;

  try {
    await assert.rejects(
      inspectSolanaTransaction({
        networkId,
        transactionSignature: signature,
        fetchImpl: async () => {
          called = true;
          throw new Error("RPC MUST NOT BE CALLED");
        }
      }),
      { message: "AFRICRYPTO_SOLANA_RPC_URL_INVALID" }
    );

    assert.equal(called, false);
  } finally {
    if (previous === undefined) delete process.env[envName];
    else process.env[envName] = previous;
  }
});

test("FTP RPC URL is rejected before network access", async () => {
  const previous = process.env[envName];
  process.env[envName] = "ftp://localhost/rpc";
  let called = false;

  try {
    await assert.rejects(
      inspectSolanaTransaction({
        networkId,
        transactionSignature: signature,
        fetchImpl: async () => {
          called = true;
          throw new Error("RPC MUST NOT BE CALLED");
        }
      }),
      { message: "AFRICRYPTO_SOLANA_RPC_URL_INVALID" }
    );

    assert.equal(called, false);
  } finally {
    if (previous === undefined) delete process.env[envName];
    else process.env[envName] = previous;
  }
});


test("confirmed but not finalized transaction remains pending", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([{
      context: { slot: 127 },
      value: [{
        slot: 127,
        confirmations: 8,
        confirmationStatus: "confirmed",
        err: null
      }]
    }]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "PENDING");
    assert.equal(result.confirmations, 8);
  });
});

test("confirmed transaction error remains pending until finalized", async () => {
  await withRpcUrl(async () => {
    const mock = mockFetch([{
      context: { slot: 128 },
      value: [{
        slot: 128,
        confirmations: 3,
        confirmationStatus: "confirmed",
        err: { InstructionError: [0, "Custom"] }
      }]
    }]);

    const result = await inspectSolanaTransaction({
      networkId,
      transactionSignature: signature,
      fetchImpl: mock.fetchImpl
    });

    assert.equal(result.outcome, "PENDING");
    assert.notEqual(result.transactionError, null);
  });
});
