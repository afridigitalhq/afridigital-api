import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import SessionService from "./AfriIdentitySessionService.js";
import { createAfriIdentityAuthenticationMiddleware } from "../middleware/AfriIdentityAuthenticationMiddleware.js";

function fixture() {
  const sessions = new Map();
  const users = new Map([
    ["USER-1", { userId: "USER-1", email: "user@example.com", status: "ACTIVE" }]
  ]);
  const roles = new Map([["USER-1", ["USER"]]]);
  const repository = {
    async findUserById(id) { return users.get(id) || null; },
    async listUserRoles(id) { return roles.get(id) || []; },
    async createSession(record) {
      sessions.set(record.tokenHash, { ...record, revokedAt: null });
      return { sessionId: record.sessionId, expiresAt: record.expiresAt };
    },
    async findActiveSessionByTokenHash(hash, now) {
      const session = sessions.get(hash);
      return session && !session.revokedAt && session.expiresAt > now
        ? { ...session }
        : null;
    },
    async findActiveSessionById(id, now) {
      for (const session of sessions.values()) {
        const user = users.get(session.userId);
        if (session.sessionId === id && !session.revokedAt && session.expiresAt > now && user?.status === "ACTIVE") return { ...session };
      }
      return null;
    },
    async revokeSession(id, now) {
      for (const session of sessions.values()) {
        if (session.sessionId === id && !session.revokedAt) {
          session.revokedAt = now;
          return session;
        }
      }
      return null;
    }
  };
  return { repository, users, sessions, roles };
}

test("requires a valid repository and bounded session lifetime", () => {
  assert.throws(
    () => new SessionService(),
    { message: "AFRI_IDENTITY_SESSION_REPOSITORY_REQUIRED" }
  );
  const { repository } = fixture();
  assert.throws(
    () => new SessionService({ repository, ttlMs: 999 }),
    { message: "AFRI_IDENTITY_SESSION_TTL_INVALID" }
  );
});

test("creates cryptographically random sessions and stores only token hashes", async () => {
  const { repository, sessions } = fixture();
  const service = new SessionService({
    repository,
    clock: () => 100000,
    ttlMs: 3600000
  });

  const first = await service.create("USER-1");
  const second = await service.create("USER-1");

  assert.notEqual(first.token, second.token);
  assert.equal(first.token.length, 43);
  assert.equal(first.expiresAt, 3700000);
  assert.equal(sessions.size, 2);
  const hash = createHash("sha256").update(first.token).digest("hex");
  assert.ok(sessions.has(hash));
  assert.equal([...sessions.values()].some(item => item.tokenHash === first.token), false);
});

test("refuses to create sessions for missing or inactive users", async () => {
  const { repository, users } = fixture();
  const service = new SessionService({ repository });

  await assert.rejects(
    service.create("MISSING"),
    { message: "AFRI_IDENTITY_USER_NOT_ACTIVE" }
  );
  users.get("USER-1").status = "SUSPENDED";
  await assert.rejects(
    service.create("USER-1"),
    { message: "AFRI_IDENTITY_USER_NOT_ACTIVE" }
  );
});

test("authenticates a session and resolves roles from the repository", async () => {
  const { repository } = fixture();
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");
  const principal = await service.authenticate(created.token);

  assert.equal(principal.userId, "USER-1");
  assert.equal(principal.email, "user@example.com");
  assert.deepEqual(principal.roles, ["USER"]);
  assert.equal(principal.sessionId, created.sessionId);
  assert.equal(Object.isFrozen(principal), true);
  assert.equal(Object.isFrozen(principal.roles), true);
});

test("rejects malformed, unknown, expired and revoked sessions", async () => {
  const { repository } = fixture();
  let now = 100000;
  const service = new SessionService({
    repository,
    clock: () => now,
    ttlMs: 60000
  });

  assert.equal(await service.authenticate("not-a-token"), null);
  const created = await service.create("USER-1");
  assert.equal(await service.authenticate(created.token) !== null, true);

  now = created.expiresAt;
  assert.equal(await service.authenticate(created.token), null);
  assert.equal(await service.authenticate("A".repeat(43)), null);
});

test("revokes a session and prevents further authentication", async () => {
  const { repository } = fixture();
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");

  assert.equal(await service.revoke(created.token), true);
  assert.equal(await service.authenticate(created.token), null);
  assert.equal(await service.revoke(created.token), false);
});

test("authentication middleware rejects missing and invalid bearer tokens", async () => {
  const middleware = createAfriIdentityAuthenticationMiddleware({
    sessionService: { async authenticate() { return null; } }
  });
  let statusCode;
  let body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; }
  };

  await middleware({ headers: {} }, res, () => assert.fail("next must not run"));
  assert.equal(statusCode, 401);
  assert.equal(body.error.code, "AFRI_IDENTITY_AUTHENTICATION_REQUIRED");

  await middleware({
    headers: { authorization: "Bearer " + "A".repeat(43) }
  }, res, () => assert.fail("next must not run"));
  assert.equal(statusCode, 401);
  assert.equal(body.error.code, "AFRI_IDENTITY_SESSION_INVALID");
});

test("middleware attaches only the authenticated principal", async () => {
  const principal = Object.freeze({
    userId: "USER-1",
    email: "user@example.com",
    roles: Object.freeze(["USER"]),
    sessionId: "SESSION-1"
  });
  const middleware = createAfriIdentityAuthenticationMiddleware({
    sessionService: { async authenticate(token) {
      assert.equal(token, "A".repeat(43));
      return principal;
    } }
  });
  const req = { headers: { authorization: "Bearer " + "A".repeat(43) } };
  let nextCalled = false;
  const result = await middleware(req, {}, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.auth, principal);
  assert.equal(result, undefined);
});

test("middleware fails closed when the authentication service is unavailable", async () => {
  const middleware = createAfriIdentityAuthenticationMiddleware({
    sessionService: { async authenticate() { throw new Error("database unavailable"); } }
  });
  let statusCode;
  let body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; }
  };

  await middleware({
    headers: { authorization: "Bearer " + "A".repeat(43) }
  }, res, () => assert.fail("next must not run"));

  assert.equal(statusCode, 503);
  assert.equal(body.error.code, "AFRI_IDENTITY_AUTHENTICATION_UNAVAILABLE");
});

test("rejects forged principals during verification", async () => {
  const { repository } = fixture();
  const service = new SessionService({ repository });
  assert.equal(await service.verifyPrincipal({ userId: "USER-1", sessionId: "SESSION-GUESSED", roles: ["ADMIN"] }), null);
});

test("verifies issued principals against the live session and current roles", async () => {
  const { repository, roles } = fixture();
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");
  const principal = await service.authenticate(created.token);
  roles.set("USER-1", ["USER", "AGENT_APPROVER"]);
  const verified = await service.verifyPrincipal(principal);
  assert.equal(verified.userId, "USER-1");
  assert.deepEqual(verified.roles, ["USER", "AGENT_APPROVER"]);
  assert.equal(verified.sessionId, created.sessionId);
  assert.notEqual(verified, principal);
  assert.equal(await service.verifyPrincipal(verified) !== null, true);
});

test("rejects an issued principal after its session is revoked", async () => {
  const { repository } = fixture();
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");
  const principal = await service.authenticate(created.token);
  assert.equal(await service.revoke(created.token), true);
  assert.equal(await service.verifyPrincipal(principal), null);
});

test("rejects an issued principal after its account is suspended", async () => {
  const { repository, users } = fixture();
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");
  const principal = await service.authenticate(created.token);
  users.get("USER-1").status = "SUSPENDED";
  assert.equal(await service.verifyPrincipal(principal), null);
});


test("bearer middleware and live principal verification enforce current roles together", async () => {
  const { repository, roles } = fixture();
  roles.set("USER-1", ["USER", "AFRIAI_DIAGNOSTICS_ADMIN"]);
  const service = new SessionService({ repository });
  const created = await service.create("USER-1");
  const middleware = createAfriIdentityAuthenticationMiddleware({
    sessionService: service
  });
  const req = {
    headers: { authorization: `Bearer ${created.token}` }
  };
  let nextCalled = false;

  await middleware(req, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.auth.userId, "USER-1");

  const verified = await service.verifyPrincipal(req.auth);
  assert.ok(verified.roles.includes("AFRIAI_DIAGNOSTICS_ADMIN"));

  roles.set("USER-1", ["USER"]);
  const reverified = await service.verifyPrincipal(verified);
  assert.deepEqual(reverified.roles, ["USER"]);
  assert.equal(reverified.roles.includes("AFRIAI_DIAGNOSTICS_ADMIN"), false);
});

test("creates a session through the audited repository path when an audit event ID is supplied", async () => {
  const { repository } = fixture();
  let auditedInput;
  repository.createSessionWithAudit = async input => {
    auditedInput = input;
    return { sessionId: input.sessionId, expiresAt: input.expiresAt };
  };
  const service = new SessionService({
    repository,
    clock: () => 100000,
    ttlMs: 3600000
  });

  const created = await service.create("USER-1", {
    auditEventId: "LOGIN-EVENT-1",
    throttleKey: "d".repeat(64)
  });

  assert.equal(created.sessionId, auditedInput.sessionId);
  assert.equal(created.expiresAt, 3700000);
  assert.equal(auditedInput.userId, "USER-1");
  assert.equal(auditedInput.eventId, "LOGIN-EVENT-1");
  assert.equal(auditedInput.throttleKey, "d".repeat(64));
  assert.match(auditedInput.tokenHash, /^[a-f0-9]{64}$/);
  assert.notEqual(auditedInput.tokenHash, created.token);
});
