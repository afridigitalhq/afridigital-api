import test from "node:test";
import assert from "node:assert/strict";
import internalA2ARoute from "./internal-a2a.route.js";
import AfriAgentProfiles from "../../../platform/agent/identity/AfriAgentProfiles.js";

const path = "/api/a2a/internal/tasks";
const sourceId = AfriAgentProfiles.afriaicommand.id;
const targetId = AfriAgentProfiles.afriaicoder.id;
const body = Buffer.from(JSON.stringify({
  agentId: targetId,
  task: {
    capability: "engineering.backend",
    payload: { objective: "Inspect backend", dependencyResults: [] }
  },
  context: {}
}));

function setup(requestAuth) {
  let handler;
  const app = { post(_path, ...stack) { handler = stack.at(-1); } };
  internalA2ARoute(app, {
    requestAuth,
    harnessRuntime: {
      createInternalExecutor({ sourceAgentId, sourceCapabilityId }) {
        assert.equal(sourceAgentId, sourceId);
        assert.equal(sourceCapabilityId, "afriaicommand.execute");
        return async () => ({ status: "PREVIEW" });
      }
    }
  });
  return handler;
}

async function invoke(handler) {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; finish(); return this; }
  };
  await handler({
    body,
    get(name) {
      return ({
        "x-afri-agent-id": sourceId,
        "x-afri-timestamp": "1794860000000",
        "x-afri-nonce": "testnonce",
        "x-afri-signature": "testsignature"
      })[name];
    }
  }, res);
  await done;
  return res;
}

test("readiness exception fails closed with 503", async () => {
  const handler = setup({
    async isReady() { throw new Error("database details"); },
    async verify() { assert.fail("verification must not run"); }
  });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.error.code, "AFRI_INTERNAL_A2A_AUTH_READINESS_UNAVAILABLE");
});

test("signature verification exception fails closed with 503", async () => {
  const handler = setup({
    async isReady() { return true; },
    async verify() { throw new Error("internal details"); }
  });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.error.code, "AFRI_INTERNAL_A2A_AUTH_VERIFICATION_UNAVAILABLE");
});

test("unverified identity is rejected with 401", async () => {
  const handler = setup({
    async isReady() { return true; },
    async verify() { return { verified: false, code: "A2A_SIGNATURE_INVALID" }; }
  });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error.code, "A2A_SIGNATURE_INVALID");
});

test("null authentication result is rejected safely with 401", async () => {
  const handler = setup({
    async isReady() { return true; },
    async verify() { return null; }
  });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error.code, "A2A_INTERNAL_AUTH_FAILED");
});
