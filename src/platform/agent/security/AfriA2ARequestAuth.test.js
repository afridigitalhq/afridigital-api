import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createAfriA2ARequestAuth } from "./AfriA2ARequestAuth.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";

const NOW = 1_800_000_000_000;
const SECRET = "test-agent-secret-that-is-at-least-32-chars";
const AGENT_ID = AfriAgentProfiles.afriai.id;
const BODY = { task: "test" };

const PUBLIC_IDENTITIES = [
  { id: AfriAgentProfiles.afriai.id, key: "afriai", status: "ACTIVE" },
  { id: AfriAgentProfiles.afridebug.id, key: "afridebug", status: "ACTIVE" },
  { id: AfriAgentProfiles.afrirea.id, key: "afrirea", status: "ACTIVE" },
  { id: AfriAgentProfiles.afriforex.id, key: "afriforex", status: "ACTIVE" }
];

function createAuth({
  secret = SECRET,
  identity,
  identityLookup,
  repository = {},
  time = NOW
} = {}) {
  const env = {
    A2A_AGENT_SECRET_AFRIDEBUG: SECRET,
    A2A_AGENT_SECRET_AFRIREA: SECRET,
    A2A_AGENT_SECRET_AFRIFOREX: SECRET,
    A2A_SHARED_SECRET: "legacy-shared-secret-that-must-not-work"
  };

  if (secret !== null) env.A2A_AGENT_SECRET_AFRIAI = secret;

  const identities = PUBLIC_IDENTITIES.map(agent =>
    agent.key === "afriai" && identity ? identity : agent
  );

  const identityRegistry = {
    get(id) {
      if (identityLookup) return identityLookup(id, identities);
      return identities.find(agent => agent.id === id) || null;
    },
    list() {
      return identities;
    }
  };

  let consumeCalls = 0;
  const nonceRepository = {
    async initialize() {
      if (repository.initError) throw new Error("database unavailable");
      return true;
    },
    async consume() {
      consumeCalls += 1;
      if (repository.error) throw new Error("database unavailable");
      return !repository.duplicate;
    }
  };

  const auth = createAfriA2ARequestAuth({
    env,
    identityRegistry,
    nonceRepositoryFactory: () => nonceRepository,
    now: () => time
  });

  function signedRequest(overrides = {}) {
    const request = {
      method: "POST",
      path: "/api/a2a/tasks",
      agentId: AGENT_ID,
      timestamp: String(time),
      nonce: "test-nonce",
      body: BODY,
      ...overrides
    };

    const payload = JSON.stringify({
      method: request.method,
      path: request.path,
      agentId: request.agentId,
      timestamp: Number(request.timestamp),
      nonce: request.nonce,
      body: request.body
    });

    const signature = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    return { ...request, signature: overrides.signature ?? signature };
  }

  return {
    auth,
    env,
    signedRequest,
    get consumeCalls() { return consumeCalls; }
  };
}

test("accepts a valid per-agent HMAC and consumes its nonce", async () => {
  const fixture = createAuth();
  const result = await fixture.auth.verify(fixture.signedRequest());
  assert.equal(result.verified, true);
  assert.equal(result.algorithm, "HMAC-SHA256");
  assert.equal(fixture.consumeCalls, 1);
});

test("binds signatures to the exact HTTP method and route path", async () => {
  const fixture = createAuth();
  const signed = fixture.signedRequest();

  assert.equal(
    (await fixture.auth.verify({ ...signed, path: "/message:send" })).code,
    "A2A_SIGNATURE_INVALID"
  );
  assert.equal(
    (await fixture.auth.verify({ ...signed, method: "GET" })).code,
    "A2A_SIGNATURE_INVALID"
  );
  assert.equal(fixture.consumeCalls, 0);

  const valid = createAuth();
  assert.equal(
    (await valid.auth.verify(valid.signedRequest())).verified,
    true
  );
});

test("rejects signatures using the legacy payload without route context", async () => {
  const fixture = createAuth();
  const request = fixture.signedRequest();
  const legacyPayload = JSON.stringify({
    agentId: request.agentId,
    timestamp: Number(request.timestamp),
    nonce: request.nonce,
    body: request.body
  });
  const legacySignature = crypto
    .createHmac("sha256", SECRET)
    .update(legacyPayload)
    .digest("hex");

  assert.equal(
    (await fixture.auth.verify({
      ...request,
      signature: legacySignature
    })).code,
    "A2A_SIGNATURE_INVALID"
  );
  assert.equal(fixture.consumeCalls, 0);
});

test("does not accept the legacy shared secret as a fallback", async () => {
  const fixture = createAuth({ secret: null });
  const result = await fixture.auth.verify(fixture.signedRequest());
  assert.equal(result.code, "A2A_AGENT_CREDENTIAL_NOT_CONFIGURED");
  assert.equal(fixture.consumeCalls, 0);
});

test("rejects unknown and internal-only identities", async () => {
  const fixture = createAuth();
  assert.equal(
    (await fixture.auth.verify(fixture.signedRequest({ agentId: "UNKNOWN" }))).code,
    "A2A_AGENT_NOT_AUTHORIZED"
  );

  const internal = createAuth({
    identity: { id: AGENT_ID, key: "afriaicommand", status: "ACTIVE" }
  });
  assert.equal(
    (await internal.auth.verify(internal.signedRequest())).code,
    "A2A_AGENT_NOT_AUTHORIZED"
  );
});

test("rejects inactive identities", async () => {
  const fixture = createAuth({
    identity: { id: AGENT_ID, key: "afriai", status: "SUSPENDED" }
  });
  assert.equal(
    (await fixture.auth.verify(fixture.signedRequest())).code,
    "A2A_AGENT_NOT_AUTHORIZED"
  );
});

test("rejects an impostor identity even when it claims a public key", async () => {
  const impostor = { id: "AGENT-IMPOSTOR", key: "afriai", status: "ACTIVE" };
  const fixture = createAuth({
    identity: impostor,
    identityLookup: () => impostor
  });

  assert.equal(
    (await fixture.auth.verify(fixture.signedRequest())).code,
    "A2A_AGENT_NOT_AUTHORIZED"
  );
  assert.equal(fixture.consumeCalls, 0);
  assert.equal(await fixture.auth.isReady(), false);
});

test("rejects an invalid signature before accessing replay storage", async () => {
  const fixture = createAuth();
  assert.equal(
    (await fixture.auth.verify(
      fixture.signedRequest({ signature: "invalid" })
    )).code,
    "A2A_SIGNATURE_INVALID"
  );
  assert.equal(fixture.consumeCalls, 0);
});

test("rejects replayed nonces", async () => {
  const fixture = createAuth({ repository: { duplicate: true } });
  assert.equal(
    (await fixture.auth.verify(fixture.signedRequest())).code,
    "A2A_NONCE_REPLAYED"
  );
});

test("fails closed when PostgreSQL replay protection is unavailable", async () => {
  const fixture = createAuth({ repository: { error: true } });
  assert.equal(
    (await fixture.auth.verify(fixture.signedRequest())).code,
    "A2A_REPLAY_PROTECTION_UNAVAILABLE"
  );
});

test("rejects expired requests", async () => {
  const fixture = createAuth();
  assert.equal(
    (await fixture.auth.verify(
      fixture.signedRequest({ timestamp: String(NOW - 300001) })
    )).code,
    "A2A_REQUEST_EXPIRED"
  );
});

test("readiness requires all four active public identities and credentials", async () => {
  const complete = createAuth();
  assert.equal(await complete.auth.isReady(), true);

  const missingCredential = createAuth({ secret: null });
  assert.equal(await missingCredential.auth.isReady(), false);

  const inactiveIdentity = createAuth({
    identity: { id: AGENT_ID, key: "afriai", status: "SUSPENDED" }
  });
  assert.equal(await inactiveIdentity.auth.isReady(), false);
});

test("readiness fails closed when PostgreSQL schema initialization fails", async () => {
  const fixture = createAuth({ repository: { initError: true } });
  assert.equal(await fixture.auth.isReady(), false);
});
