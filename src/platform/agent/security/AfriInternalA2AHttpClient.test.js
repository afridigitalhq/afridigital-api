import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createAfriInternalA2AHttpClient } from "./AfriInternalA2AHttpClient.js";

const secret = "test-internal-agent-secret-at-least-32-bytes";
const env = {
  A2A_INTERNAL_AGENT_SECRET_AFRIAICOMMAND: secret,
  A2A_INTERNAL_BASE_URL: "https://afridigital-api.onrender.com"
};
const request = {
  agentId: "AGENT-AFRIAICODER-001",
  task: { capability: "engineering.backend", payload: { objective: "Test" } },
  context: { requestId: "test-request" }
};
const encoder = new TextEncoder();

function streamResponse(text, { ok = true, status = 200, chunks } = {}) {
  const bytes = encoder.encode(text);
  const parts = chunks || [bytes];
  let index = 0;
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) {
      if (index < parts.length) controller.enqueue(parts[index++]);
      else controller.close();
    },
    cancel() { cancelled = true; }
  }, { highWaterMark: 0 });
  return {
    ok, status, body,
    get cancelled() { return cancelled; }
  };
}

function client(fetchImpl, overrides = {}) {
  return createAfriInternalA2AHttpClient({
    env, fetchImpl, now: () => 1794860000000, ...overrides
  });
}

test("signs the canonical internal request and returns structured result", async () => {
  let captured;
  const instance = client(async (url, options) => {
    captured = { url, options };
    return streamResponse(JSON.stringify({ ok: true, result: { status: "PREVIEW" } }));
  });
  const result = await instance.execute(request);
  assert.deepEqual(result, { status: "PREVIEW" });
  assert.equal(captured.url, "https://afridigital-api.onrender.com/api/a2a/internal/tasks");
  assert.equal(captured.options.method, "POST");
  const body = JSON.parse(captured.options.body);
  const signed = {
    method: "POST",
    path: "/api/a2a/internal/tasks",
    agentId: "AGENT-AFRIAICOMMAND-001",
    timestamp: 1794860000000,
    nonce: captured.options.headers["x-afri-nonce"],
    body
  };
  const expected = crypto.createHmac("sha256", secret)
    .update(JSON.stringify(signed), "utf8").digest("hex");
  assert.equal(captured.options.headers["x-afri-signature"], expected);
  assert.equal(captured.options.headers["x-afri-agent-id"], signed.agentId);
});

test("rejects a base URL containing a path before making a request", async () => {
  let called = false;
  const instance = createAfriInternalA2AHttpClient({
    env: { ...env, A2A_INTERNAL_BASE_URL: "https://example.com/prefix" },
    fetchImpl: async () => { called = true; }
  });
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_BASE_URL_INVALID"
  });
  assert.equal(called, false);
});

test("rejects oversized response while streaming and cancels the reader", async () => {
  const chunks = [new Uint8Array(40000), new Uint8Array(30000)];
  let response;
  const instance = client(async () => {
    response = streamResponse("", { chunks });
    return response;
  });
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_RESPONSE_TOO_LARGE"
  });
  assert.equal(response.cancelled, true);
});

test("rejects malformed response JSON", async () => {
  const instance = client(async () => streamResponse("{invalid"));
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_RESPONSE_INVALID"
  });
});

test("preserves validated remote error codes", async () => {
  const instance = client(async () => streamResponse(
    JSON.stringify({ ok: false, error: { code: "AFRI_INTERNAL_A2A_TASK_INVALID" } }),
    { ok: false, status: 400 }
  ));
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_TASK_INVALID"
  });
});

test("maps transport failures to a stable error", async () => {
  const instance = client(async () => { throw new Error("network details"); });
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_TRANSPORT_FAILED"
  });
});

test("rejects invalid timeout configuration", async () => {
  const instance = client(async () => { throw new Error("must not fetch"); }, {
    timeoutMs: 0
  });
  await assert.rejects(instance.execute(request), {
    message: "AFRI_INTERNAL_A2A_TIMEOUT_INVALID"
  });
});
