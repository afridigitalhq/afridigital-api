import test from "node:test";
import assert from "node:assert/strict";
import ollamaNemotronDiagnosticRoute from "./ollama-nemotron-diagnostic.route.js";
import { OLLAMA_DIAGNOSTICS_ROLE } from "./ollama-diagnostics-auth.js";

const token = "a".repeat(40);
function harness() {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  return {
    statusCode: 200, body: null, headers: {}, done,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(body) { this.body = body; finish(); return this; }
  };
}
function setup(client, roles = [OLLAMA_DIAGNOSTICS_ROLE]) {
  const sessionService = {
    async authenticate(value) { return value === token ? { userId: "TEST-USER" } : null; },
    async verifyPrincipal() { return { userId: "TEST-USER", roles }; }
  };
  const routes = new Map();
  ollamaNemotronDiagnosticRoute({ post(path, ...handlers) { routes.set(path, handlers); } }, {
    getIdentityRuntime: () => ({ sessionService }), client
  });
  return routes.get("/api/afriai/ollama-nemotron-diagnostic");
}
async function invoke(stack) {
  const res = harness();
  const req = { headers: { authorization: "Bearer " + token } };
  const next = () => Promise.resolve(stack[1](req, res)).catch(() => {
    if (!res.body) res.status(500).json({ error: "TEST_HANDLER_ERROR" });
  });
  Promise.resolve(stack[0](req, res, next)).catch(() => {
    if (!res.body) res.status(500).json({ error: "TEST_AUTH_ERROR" });
  });
  await res.done;
  return res;
}
async function withKey(key, fn) {
  const old = process.env.OLLAMA_API_KEY;
  if (key === null) delete process.env.OLLAMA_API_KEY;
  else process.env.OLLAMA_API_KEY = key;
  try { await fn(); }
  finally {
    if (old === undefined) delete process.env.OLLAMA_API_KEY;
    else process.env.OLLAMA_API_KEY = old;
  }
}

test("Nemotron diagnostic sends the exact model and one-token chat request", async () => {
  await withKey("test-only-key", async () => {
    let request;
    const stack = setup({ async post(url, body, config) {
      request = { url, body, config };
      return { status: 200, data: { message: { content: "OK" } } };
    }});
    const res = await invoke(stack);
    assert.equal(res.body.status, "SUCCESS");
    assert.equal(res.body.model, "nemotron-3-nano:30b");
    assert.equal(request.url, "https://ollama.com/api/chat");
    assert.equal(request.body.model, "nemotron-3-nano:30b");
    assert.deepEqual(request.body.messages, [{ role: "user", content: "Reply with OK." }]);
    assert.equal(request.body.options.num_predict, 1);
    assert.equal(request.config.headers.Authorization, "Bearer test-only-key");
    assert.equal(JSON.stringify(res.body).includes("OK"), false);
    assert.equal(res.headers["Cache-Control"], "no-store");
  });
});

test("Nemotron diagnostic reports HTTP 402 without upstream response details", async () => {
  await withKey("test-only-key", async () => {
    const stack = setup({ async post() {
      const error = new Error("private upstream details");
      error.response = { status: 402, data: { error: "private upstream details" } };
      throw error;
    }});
    const res = await invoke(stack);
    assert.equal(res.body.status, "PAYMENT_REQUIRED");
    assert.equal(res.body.upstreamStatus, 402);
    assert.equal(JSON.stringify(res.body).includes("private upstream"), false);
  });
});

test("Nemotron diagnostic rejects non-admin users before contacting Ollama", async () => {
  await withKey("test-only-key", async () => {
    let calls = 0;
    const stack = setup({ async post() { calls++; return { status: 200 }; } }, ["USER"]);
    const res = await invoke(stack);
    assert.equal(res.statusCode, 403);
    assert.equal(calls, 0);
  });
});
