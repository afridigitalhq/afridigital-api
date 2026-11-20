import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createAfriInternalA2ARequestAuth } from "./AfriInternalA2ARequestAuth.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";

const NOW = 1_800_000_000_000;
const SECRET = "internal-test-secret-with-at-least-32-characters";
const AGENT = AfriAgentProfiles.afriaicommand;
const BODY = { task: "test" };

function fixture({ identity = {
  id: AGENT.id, key: "afriaicommand", status: "ACTIVE",
  organizationId: "afridigital", trustDomain: "INTERNAL"
}, duplicate = false, dbError = false } = {}) {
  const env = {
    A2A_INTERNAL_AGENT_SECRET_AFRIAICOMMAND: SECRET,
    A2A_INTERNAL_AGENT_SECRET_AFRIAICODER: SECRET
  };
  const identities = [
    identity,
    {
      id: AfriAgentProfiles.afriaicoder.id, key: "afriaicoder",
      status: "ACTIVE", organizationId: "afridigital", trustDomain: "INTERNAL"
    }
  ];
  let consumed = 0;
  const repository = {
    async initialize() { if (dbError) throw new Error("db unavailable"); },
    async consume() {
      consumed += 1;
      if (dbError) throw new Error("db unavailable");
      return !duplicate;
    }
  };
  const auth = createAfriInternalA2ARequestAuth({
    env,
    identityRegistry: {
      get(id) { return identities.find(item => item.id === id) || null; },
      list() { return identities; }
    },
    nonceRepositoryFactory: () => repository,
    now: () => NOW
  });

  function signed(overrides = {}) {
    const request = {
      method: "POST",
      path: "/api/a2a/internal/tasks",
      agentId: AGENT.id,
      timestamp: String(NOW),
      nonce: "nonce_value_123456789",
      body: BODY,
      ...overrides
    };
    const payload = JSON.stringify({
      method: request.method, path: request.path, agentId: request.agentId,
      timestamp: Number(request.timestamp), nonce: request.nonce, body: request.body
    });
    return {
      ...request,
      signature: crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
    };
  }
  return { auth, signed, getConsumed: () => consumed };
}

test("accepts a correctly signed active internal identity", async () => {
  const f = fixture();
  const result = await f.auth.verify(f.signed());
  assert.equal(result.verified, true);
  assert.equal(result.requestOrigin, "INTERNAL");
  assert.equal(f.getConsumed(), 1);
});

test("rejects a public or wrong-organization identity", async () => {
  const f = fixture({ identity: {
    id: AGENT.id, key: "afriaicommand", status: "ACTIVE",
    organizationId: "other", trustDomain: "INTERNAL"
  } });
  assert.equal((await f.auth.verify(f.signed())).verified, false);
  assert.equal(f.getConsumed(), 0);
});

test("rejects invalid signatures before consuming nonce", async () => {
  const f = fixture();
  const request = f.signed();
  request.signature = "0".repeat(64);
  assert.equal((await f.auth.verify(request)).code, "A2A_SIGNATURE_INVALID");
  assert.equal(f.getConsumed(), 0);
});

test("rejects replayed nonces", async () => {
  const f = fixture({ duplicate: true });
  assert.equal((await f.auth.verify(f.signed())).code, "A2A_NONCE_REPLAYED");
});

test("fails closed when replay protection is unavailable", async () => {
  const f = fixture({ dbError: true });
  assert.equal((await f.auth.verify(f.signed())).code, "A2A_REPLAY_PROTECTION_UNAVAILABLE");
});

test("rejects stale timestamps and malformed nonces", async () => {
  const f = fixture();
  assert.equal((await f.auth.verify(f.signed({ timestamp: String(NOW - 300001) }))).code, "A2A_REQUEST_EXPIRED");
  assert.equal((await f.auth.verify(f.signed({ nonce: "short" }))).code, "A2A_NONCE_INVALID");
});

test("readiness requires both internal credentials and replay storage", async () => {
  const f = fixture();
  assert.equal(await f.auth.isReady(), true);
});
