import test from "node:test";
import assert from "node:assert/strict";
import ollamaDebugRoute from "./ollama-debug.route.js";
import ollamaTestRoute from "./ollama-test.route.js";
import { OLLAMA_DIAGNOSTICS_ROLE } from "./ollama-diagnostics-auth.js";

const token = "a".repeat(40);

function responseHarness() {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });

  return {
    statusCode: 200,
    body: null,
    headers: {},
    done,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    json(body) {
      this.body = body;
      finish();
      return this;
    }
  };
}

function runtimeFor(roles = [], verified = true) {
  const calls = { authenticated: 0, verified: 0 };
  const sessionService = {
    async authenticate(value) {
      calls.authenticated++;
      return value === token ? { userId: "AUTHENTICATED-USER" } : null;
    },
    async verifyPrincipal() {
      calls.verified++;
      return verified
        ? { userId: "USER-1", roles: [...roles] }
        : null;
    }
  };

  return { runtime: { sessionService }, calls };
}

function setupDebug(getIdentityRuntime) {
  const routes = new Map();
  ollamaDebugRoute({
    get(path, ...handlers) {
      routes.set(path, handlers);
    }
  }, { getIdentityRuntime });
  return routes.get("/api/afriai/ollama-debug");
}

function setupTest(getIdentityRuntime, provider, timeoutMs) {
  const routes = new Map();
  ollamaTestRoute({
    get(path, ...handlers) {
      routes.set(path, handlers);
    }
  }, { getIdentityRuntime, provider, timeoutMs });
  return routes.get("/api/afriai/ollama-test");
}

async function invoke(stack, headers = { authorization: "Bearer " + token }) {
  const res = responseHarness();
  const req = { headers };

  const next = () => {
    Promise.resolve(stack[1](req, res)).catch(() => {
      if (!res.body) res.status(500).json({ error: { code: "TEST_HANDLER_ERROR" } });
    });
  };

  Promise.resolve(stack[0](req, res, next)).catch(() => {
    if (!res.body) res.status(500).json({ error: { code: "TEST_MIDDLEWARE_ERROR" } });
  });

  await res.done;
  return res;
}

test("both diagnostics endpoints fail closed when identity runtime is unavailable", async () => {
  const unavailable = () => { throw new Error("NOT_INITIALIZED"); };

  for (const stack of [
    setupDebug(unavailable),
    setupTest(unavailable, { async generate() { throw new Error("must not run"); } })
  ]) {
    const res = await invoke(stack);
    assert.equal(res.statusCode, 503);
  }
});

test("diagnostics endpoints reject missing bearer authentication", async () => {
  const { runtime } = runtimeFor([OLLAMA_DIAGNOSTICS_ROLE]);

  for (const stack of [
    setupDebug(() => runtime),
    setupTest(() => runtime, { async generate() { throw new Error("must not run"); } })
  ]) {
    const res = await invoke(stack, {});
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.error.code, "AFRI_IDENTITY_AUTHENTICATION_REQUIRED");
  }
});

test("diagnostics endpoints reject invalid verified principals", async () => {
  const { runtime } = runtimeFor([OLLAMA_DIAGNOSTICS_ROLE], false);

  for (const stack of [
    setupDebug(() => runtime),
    setupTest(() => runtime, { async generate() { throw new Error("must not run"); } })
  ]) {
    const res = await invoke(stack);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.error.code, "AFRI_IDENTITY_PRINCIPAL_INVALID");
  }
});

test("ordinary USER and AGENT_APPROVER roles cannot access diagnostics", async () => {
  const { runtime } = runtimeFor(["USER", "AGENT_APPROVER"]);
  let inferenceCalls = 0;

  const debug = await invoke(setupDebug(() => runtime));
  const inference = await invoke(setupTest(
    () => runtime,
    { async generate() { inferenceCalls++; return "unexpected"; } }
  ));

  assert.equal(debug.statusCode, 403);
  assert.equal(inference.statusCode, 403);
  assert.equal(inferenceCalls, 0);
});

test("debug endpoint returns only non-secret configuration metadata to authorized admins", async () => {
  const { runtime } = runtimeFor(["USER", OLLAMA_DIAGNOSTICS_ROLE]);
  const res = await invoke(setupDebug(() => runtime));

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.provider, "ollama");
  assert.equal(res.body.environment.OLLAMA_API_KEY, "NOT_SET");
  assert.equal(res.headers["Cache-Control"], "no-store");
  assert.equal(Object.hasOwn(res.body.environment, "OLLAMA_URL_VALUE"), false);
});

test("inference endpoint returns a bounded result to authorized admins", async () => {
  const { runtime } = runtimeFor([OLLAMA_DIAGNOSTICS_ROLE]);
  let receivedPrompt;

  const res = await invoke(setupTest(
    () => runtime,
    {
      async generate(prompt) {
        receivedPrompt = prompt;
        return "x".repeat(2500);
      }
    }
  ));

  assert.equal(res.statusCode, 200);
  assert.equal(receivedPrompt, "Explain AfriCommerce in one sentence.");
  assert.equal(res.body.status, "SUCCESS");
  assert.equal(res.body.result.length, 2000);
  assert.equal(res.headers["Cache-Control"], "no-store");
});

test("provider failures never expose internal exception messages", async () => {
  const { runtime } = runtimeFor([OLLAMA_DIAGNOSTICS_ROLE]);

  const res = await invoke(setupTest(
    () => runtime,
    { async generate() { throw new Error("private upstream credential detail"); } }
  ));

  assert.equal(res.statusCode, 502);
  assert.equal(res.body.error, "OLLAMA_DIAGNOSTIC_FAILED");
  assert.equal(JSON.stringify(res.body).includes("private upstream"), false);
});

test("inference endpoint enforces its execution timeout", async () => {
  const { runtime } = runtimeFor([OLLAMA_DIAGNOSTICS_ROLE]);

  const res = await invoke(setupTest(
    () => runtime,
    { generate() { return new Promise(() => {}); } },
    5
  ));

  assert.equal(res.statusCode, 504);
  assert.equal(res.body.error, "OLLAMA_DIAGNOSTIC_TIMEOUT");
});
