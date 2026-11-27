import test from "node:test";
import assert from "node:assert/strict";
import ollamaCloudAuthTestRoute from "./ollama-cloud-auth-test.route.js";
import { OLLAMA_DIAGNOSTICS_ROLE } from "./ollama-diagnostics-auth.js";

const token = "a".repeat(40);
const testKey = "test-only-ollama-key";

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

function setup(client, roles = [OLLAMA_DIAGNOSTICS_ROLE]) {
  const sessionService = {
    async authenticate(value) {
      return value === token ? { userId: "AUTHENTICATED-USER" } : null;
    },
    async verifyPrincipal() {
      return { userId: "USER-1", roles: [...roles] };
    }
  };

  const routes = new Map();

  ollamaCloudAuthTestRoute({
    post(path, ...handlers) {
      routes.set(path, handlers);
    }
  }, {
    getIdentityRuntime: () => ({ sessionService }),
    client
  });

  return routes.get("/api/afriai/ollama-cloud-auth-test");
}

async function invoke(stack) {
  const res = responseHarness();
  const req = {
    headers: { authorization: "Bearer " + token }
  };

  const next = () => {
    Promise.resolve(stack[1](req, res)).catch(() => {
      if (!res.body) res.status(500).json({ error: "TEST_HANDLER_ERROR" });
    });
  };

  Promise.resolve(stack[0](req, res, next)).catch(() => {
    if (!res.body) res.status(500).json({ error: "TEST_MIDDLEWARE_ERROR" });
  });

  await res.done;
  return res;
}

async function withApiKey(value, fn) {
  const previous = process.env.OLLAMA_API_KEY;

  if (value === null) delete process.env.OLLAMA_API_KEY;
  else process.env.OLLAMA_API_KEY = value;

  try {
    await fn();
  } finally {
    if (previous === undefined) delete process.env.OLLAMA_API_KEY;
    else process.env.OLLAMA_API_KEY = previous;
  }
}

test("valid cloud authentication returns AUTHORIZED without exposing generated text", async () => {
  await withApiKey(testKey, async () => {
    let received;

    const stack = setup({
      async post(url, body, config) {
        received = { url, body, config };
        return { status: 200, data: { message: { content: "private generated output" } } };
      }
    });

    const res = await invoke(stack);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "AUTHORIZED");
    assert.equal(res.body.model, "gemma4:31b");
    assert.equal(received.url, "https://ollama.com/api/chat");
    assert.equal(received.config.headers.Authorization, `Bearer ${testKey}`);
    assert.equal(received.body.stream, false);
    assert.equal(received.body.options.num_predict, 1);
    assert.equal(JSON.stringify(res.body).includes("private generated output"), false);
    assert.equal(res.headers["Cache-Control"], "no-store");
  });
});

test("HTTP 401 is classified as UNAUTHORIZED without exposing upstream details", async () => {
  await withApiKey(testKey, async () => {
    const stack = setup({
      async post() {
        const error = new Error("private upstream response");
        error.response = { status: 401, data: { error: "private upstream response" } };
        throw error;
      }
    });

    const res = await invoke(stack);

    assert.equal(res.body.status, "UNAUTHORIZED");
    assert.equal(res.body.upstreamStatus, 401);
    assert.equal(JSON.stringify(res.body).includes("private upstream"), false);
  });
});

test("model errors are distinguished from authentication failures", async () => {
  await withApiKey(testKey, async () => {
    const stack = setup({
      async post() {
        const error = new Error("private model detail");
        error.response = { status: 404, data: { error: "private model detail" } };
        throw error;
      }
    });

    const res = await invoke(stack);

    assert.equal(res.body.status, "MODEL_ACCESS_ERROR");
    assert.equal(res.body.upstreamStatus, 404);
    assert.equal(JSON.stringify(res.body).includes("private model detail"), false);
  });
});

test("missing API key prevents any upstream request", async () => {
  await withApiKey(null, async () => {
    let calls = 0;
    const stack = setup({
      async post() {
        calls++;
        throw new Error("must not run");
      }
    });

    const res = await invoke(stack);

    assert.equal(res.statusCode, 503);
    assert.equal(res.body.status, "KEY_NOT_CONFIGURED");
    assert.equal(calls, 0);
  });
});

test("ordinary users cannot trigger the cloud authentication request", async () => {
  await withApiKey(testKey, async () => {
    let calls = 0;
    const stack = setup({
      async post() {
        calls++;
        return { status: 200, data: {} };
      }
    }, ["USER", "AGENT_APPROVER"]);

    const res = await invoke(stack);

    assert.equal(res.statusCode, 403);
    assert.equal(calls, 0);
  });
});
