import test from "node:test";
import assert from "node:assert/strict";
import { AfriIdentityPostgresRepository } from "./AfriIdentityPostgresRepository.js";

function createPool(handler = async () => ({ rows: [] })) {
  const calls = [];
  const query = async (sql, values = []) => {
    calls.push({ sql, values });
    return handler(sql, values);
  };
  return {
    calls,
    pool: {
      query,
      async connect() { return { query, release() {} }; }
    }
  };
}

test("requires a PostgreSQL pool", () => {
  assert.throws(
    () => new AfriIdentityPostgresRepository(),
    { message: "AFRI_IDENTITY_POSTGRES_POOL_REQUIRED" }
  );
});

test("initializes identity tables and indexes once", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });

  assert.equal(await repository.initialize(), true);
  assert.equal(await repository.initialize(), true);
  assert.equal(calls.length, 1);
  for (const table of [
    "afri_human_users",
    "afri_human_user_roles",
    "afri_human_sessions",
    "afri_identity_audit_events",
    "afri_identity_recovery_uses"
  ]) assert.match(calls[0].sql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  assert.match(calls[0].sql, /CREATE INDEX IF NOT EXISTS idx_afri_human_sessions_user/);
  assert.match(calls[0].sql, /CREATE INDEX IF NOT EXISTS idx_afri_identity_audit_created/);
  assert.match(calls[0].sql, /CREATE TABLE IF NOT EXISTS afri_identity_login_attempts/);
  assert.match(calls[0].sql, /CREATE INDEX IF NOT EXISTS idx_afri_identity_login_attempts_updated/);
});

test("resets failed initialization so it can be retried", async () => {
  let attempts = 0;
  const { pool } = createPool(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error("temporary database failure");
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(repository.initialize(), /temporary database failure/);
  assert.equal(await repository.initialize(), true);
  assert.equal(attempts, 2);
});

test("creates users with normalized email and maps returned records", async () => {
  const { pool, calls } = createPool(async (_sql, values) => ({
    rows: [{
      user_id: values[0],
      email: values[1],
      password_hash: values[2],
      status: "ACTIVE",
      created_at: values[3],
      updated_at: values[3]
    }]
  }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const user = await repository.createUser({
    userId: "USER-1",
    email: "Person@Example.com",
    passwordHash: "scrypt-hash",
    now: 1000
  });

  assert.equal(user.email, "person@example.com");
  assert.equal(user.userId, "USER-1");
  assert.equal(user.status, "ACTIVE");
  assert.equal(user.createdAt, 1000);
  assert.equal(calls[0].values[1], "person@example.com");
  assert.equal(calls[0].values[2], "scrypt-hash");
});

test("rejects invalid email and missing password hash before database access", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.createUser({ userId: "U1", email: "invalid", passwordHash: "hash" }),
    { message: "AFRI_IDENTITY_EMAIL_INVALID" }
  );
  await assert.rejects(
    repository.createUser({ userId: "U1", email: "a@example.com" }),
    { message: "AFRI_IDENTITY_PASSWORD_HASH_REQUIRED" }
  );
  assert.equal(calls.length, 0);
});

test("validates role names before issuing database queries", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.replaceUserRoles("USER-1", ["admin", "ROOT"]),
    { message: "AFRI_IDENTITY_ROLES_INVALID" }
  );
  assert.equal(calls.length, 0);
});

test("creates sessions only with a valid SHA-256 token hash", async () => {
  const tokenHash = "a".repeat(64);
  const { pool, calls } = createPool(async (_sql, values) => ({
    rows: [{
      session_id: values[0],
      user_id: values[1],
      token_hash: values[2],
      created_at: values[3],
      expires_at: values[4],
      revoked_at: null
    }]
  }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const session = await repository.createSession({
    sessionId: "SESSION-1",
    userId: "USER-1",
    tokenHash,
    createdAt: 100,
    expiresAt: 200
  });

  assert.equal(session.sessionId, "SESSION-1");
  assert.equal(session.tokenHash, tokenHash);
  assert.equal(session.revokedAt, null);
  assert.ok(calls.some(call => call.sql.includes("status = $2") && call.values[1] === "ACTIVE"));

  await assert.rejects(
    repository.createSession({
      sessionId: "SESSION-2",
      userId: "USER-1",
      tokenHash: "plaintext-token",
      createdAt: 100,
      expiresAt: 200
    }),
    { message: "AFRI_IDENTITY_TOKEN_HASH_INVALID" }
  );
});

test("stores audit details as parameterized JSON rather than SQL text", async () => {
  const { pool, calls } = createPool(async (_sql, values) => ({
    rows: [{
      event_id: values[0],
      actor_user_id: values[1],
      event_type: values[2],
      subject_user_id: values[3],
      outcome: values[4],
      details: JSON.parse(values[5]),
      created_at: values[6]
    }]
  }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const event = await repository.appendAuditEvent({
    eventId: "EVENT-1",
    eventType: "LOGIN",
    outcome: "SUCCESS",
    details: { method: "password" },
    createdAt: 500
  });

  assert.equal(event.eventId, "EVENT-1");
  assert.deepEqual(event.details, { method: "password" });
  assert.equal(event.createdAt, 500);
  assert.deepEqual(calls[0].values[5], '{"method":"password"}');
  assert.match(calls[0].sql, /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6::jsonb, \$7\)/);
});


test("rejects invalid session creation timestamps before database access", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.createSession({ sessionId: "S1", userId: "U1", tokenHash: "a".repeat(64), createdAt: -1, expiresAt: 10 }), { message: "AFRI_IDENTITY_SESSION_CREATED_AT_INVALID" });
  await assert.rejects(repository.createSession({ sessionId: "S1", userId: "U1", tokenHash: "a".repeat(64), createdAt: 10, expiresAt: 10 }), { message: "AFRI_IDENTITY_SESSION_EXPIRY_INVALID" });
  assert.equal(calls.length, 0);
});

test("requires transaction support for role replacement and account status changes", async () => {
  const pool = { async query() { return { rows: [] }; } };
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.replaceUserRoles("U1", ["ADMIN"]), { message: "AFRI_IDENTITY_TRANSACTION_REQUIRED" });
  await assert.rejects(repository.setUserStatus("U1", "SUSPENDED"), { message: "AFRI_IDENTITY_TRANSACTION_REQUIRED" });
});

test("suspending an account revokes its sessions in the same transaction", async () => {
  const { pool, calls } = createPool(async sql => ({ rows: /UPDATE afri_human_users/.test(sql) ? [{ user_id: "U1", email: "u@example.com", status: "SUSPENDED", created_at: 1, updated_at: 2 }] : [] }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const user = await repository.setUserStatus("U1", "SUSPENDED", 2);
  assert.equal(user.status, "SUSPENDED");
  assert.ok(calls.some(call => /UPDATE afri_human_sessions SET revoked_at/.test(call.sql)));
  assert.equal(calls.at(-1).sql, "COMMIT");
});

test("rolls back failed account status changes and releases the client", async () => {
  const calls = [];
  let released = false;
  const pool = {
    async query() { return { rows: [] }; },
    async connect() {
      return {
        async query(sql) {
          calls.push(sql);
          if (sql.startsWith("UPDATE afri_human_users")) throw new Error("database write failed");
          return { rows: [] };
        },
        release() { released = true; }
      };
    }
  };
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.setUserStatus("U1", "SUSPENDED", 10), /database write failed/);
  assert.ok(calls.includes("BEGIN"));
  assert.ok(calls.includes("ROLLBACK"));
  assert.equal(calls.includes("COMMIT"), false);
  assert.equal(released, true);
});

test("rolls back failed role replacement and releases the client", async () => {
  const calls = [];
  let released = false;
  const pool = {
    async query() { return { rows: [] }; },
    async connect() {
      return {
        async query(sql) {
          calls.push(sql);
          if (sql.startsWith("INSERT INTO afri_human_user_roles")) throw new Error("role insert failed");
          if (sql.startsWith("SELECT user_id")) return { rows: [{ user_id: "U1" }] };
          return { rows: [] };
        },
        release() { released = true; }
      };
    }
  };
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.replaceUserRoles("U1", ["ADMIN"], 10), /role insert failed/);
  assert.ok(calls.includes("BEGIN"));
  assert.ok(calls.includes("ROLLBACK"));
  assert.equal(calls.includes("COMMIT"), false);
  assert.equal(released, true);
});

test("rejects missing users during status changes and releases the client", async () => {
  const calls = [];
  let released = false;
  const pool = {
    async query() { return { rows: [] }; },
    async connect() {
      return {
        async query(sql) {
          calls.push(sql);
          return { rows: [] };
        },
        release() { released = true; }
      };
    }
  };
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.setUserStatus("MISSING", "SUSPENDED", 10), {
    message: "AFRI_IDENTITY_USER_NOT_FOUND"
  });
  assert.ok(calls.includes("ROLLBACK"));
  assert.equal(released, true);
});

test("rejects sensitive and oversized audit metadata before database access", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });
  const base = { eventId: "E1", eventType: "LOGIN", outcome: "SUCCESS" };
  await assert.rejects(
    repository.appendAuditEvent({ ...base, details: { accessToken: "secret" } }),
    { message: "AFRI_IDENTITY_AUDIT_SENSITIVE_FIELD" }
  );
  await assert.rejects(
    repository.appendAuditEvent({ ...base, details: { payload: "x".repeat(9000) } }),
    { message: "AFRI_IDENTITY_AUDIT_DETAILS_TOO_LARGE" }
  );
  await assert.rejects(
    repository.appendAuditEvent({ ...base, details: (() => { let value = true; for (let n = 0; n < 9; n++) value = { nested: value }; return value; })() }),
    { message: "AFRI_IDENTITY_AUDIT_DETAILS_INVALID" }
  );
  assert.equal(calls.length, 0);
});

test("rejects invalid timestamps in session lookup and revocation methods", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.findActiveSessionByTokenHash("a".repeat(64), -1), {
    message: "AFRI_IDENTITY_TIMESTAMP_INVALID"
  });
  await assert.rejects(repository.revokeSession("S1", -1), {
    message: "AFRI_IDENTITY_TIMESTAMP_INVALID"
  });
  await assert.rejects(repository.revokeUserSessions("U1", -1), {
    message: "AFRI_IDENTITY_TIMESTAMP_INVALID"
  });
  await assert.rejects(repository.appendAuditEvent({
    eventId: "E1", eventType: "LOGIN", outcome: "SUCCESS", createdAt: -1
  }), { message: "AFRI_IDENTITY_TIMESTAMP_INVALID" });
  assert.equal(calls.length, 0);
});

test("finds an active session by session ID and verifies active account status", async () => {
  const { pool, calls } = createPool(async (_sql, values) => ({ rows: [{ session_id: values[0], user_id: "USER-1", token_hash: "a".repeat(64), created_at: 100, expires_at: 200, revoked_at: null }] }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const session = await repository.findActiveSessionById("SESSION-1", 150);
  assert.equal(session.sessionId, "SESSION-1");
  assert.equal(session.userId, "USER-1");
  assert.equal(session.expiresAt, 200);
  assert.deepEqual(calls[0].values, ["SESSION-1", 150, "ACTIVE"]);
  assert.match(calls[0].sql, /revoked_at IS NULL/);
  assert.match(calls[0].sql, /expires_at > \$2/);
});

test("rejects invalid session ID lookup timestamps before database access", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });
  await assert.rejects(repository.findActiveSessionById("SESSION-1", -1), { message: "AFRI_IDENTITY_TIMESTAMP_INVALID" });
  await assert.rejects(repository.findActiveSessionById(" ", 100), { message: "AFRI_IDENTITY_SESSION_ID_REQUIRED" });
  assert.equal(calls.length, 0);
});


// AUDIT_EVENT_TRANSACTION_CLIENT_TEST
test('writes audit events through the supplied transaction client instead of the pool', async () => {
  const poolCalls = [];
  const clientCalls = [];
  const pool = {
    async query(sql, values = []) {
      poolCalls.push({ sql, values });
      return { rows: [] };
    }
  };
  const client = {
    async query(sql, values = []) {
      clientCalls.push({ sql, values });
      return {
        rows: [{
          event_id: values[0],
          actor_user_id: values[1],
          event_type: values[2],
          subject_user_id: values[3],
          outcome: values[4],
          details: JSON.parse(values[5]),
          created_at: values[6]
        }]
      };
    }
  };
  const repository = new AfriIdentityPostgresRepository({ pool });

  const event = await repository.appendAuditEvent({
    eventId: 'EVENT-TX-1',
    eventType: 'AGENT_EXECUTION_GRANT_CREATED',
    outcome: 'SUCCESS',
    details: { grantId: 'grant-1', stepCount: 2 },
    createdAt: 13000,
    client
  });

  assert.equal(event.eventId, 'EVENT-TX-1');
  assert.equal(event.eventType, 'AGENT_EXECUTION_GRANT_CREATED');
  assert.deepEqual(event.details, { grantId: 'grant-1', stepCount: 2 });
  assert.equal(clientCalls.length, 1);
  assert.match(clientCalls[0].sql, /INSERT INTO afri_identity_audit_events/);
  assert.equal(poolCalls.length, 0);
});

test("creates the initial admin, role, and audit event in one transaction", async () => {
  const { pool, calls } = createPool(async (sql, values) => {
    if (sql.includes("SELECT user_id FROM afri_human_users LIMIT 1")) return { rows: [] };
    if (sql.includes("INSERT INTO afri_human_users")) return { rows: [{
      user_id: values[0], email: values[1], status: "ACTIVE",
      created_at: values[3], updated_at: values[3]
    }] };
    if (sql.includes("INSERT INTO afri_identity_audit_events")) return { rows: [{
      event_id: values[0], actor_user_id: values[1], event_type: values[2],
      subject_user_id: values[3], outcome: values[4],
      details: JSON.parse(values[5]), created_at: values[6]
    }] };
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  const user = await repository.createInitialAdminWithAudit({
    userId: "ADMIN-1", email: "Admin@Example.com",
    passwordHash: "scrypt$test", eventId: "EVENT-1", now: 1000
  });

  assert.equal(user.userId, "ADMIN-1");
  assert.equal(user.email, "admin@example.com");
  const sql = calls.map(call => call.sql);
  assert.equal(sql[0], "BEGIN");
  assert.ok(sql.some(statement => statement.includes("pg_advisory_xact_lock")));
  assert.ok(sql.some(statement => statement.includes("INSERT INTO afri_human_user_roles")));
  assert.ok(sql.some(statement => statement.includes("INSERT INTO afri_identity_audit_events")));
  assert.equal(sql.at(-1), "COMMIT");
  assert.ok(sql.indexOf(sql.find(statement => statement.includes("INSERT INTO afri_identity_audit_events"))) < sql.indexOf("COMMIT"));
});

test("rolls back initial-admin creation when its audit insert fails", async () => {
  const { pool, calls } = createPool(async (sql, values) => {
    if (sql.includes("SELECT user_id FROM afri_human_users LIMIT 1")) return { rows: [] };
    if (sql.includes("INSERT INTO afri_human_users")) return { rows: [{
      user_id: values[0], email: values[1], status: "ACTIVE",
      created_at: values[3], updated_at: values[3]
    }] };
    if (sql.includes("INSERT INTO afri_identity_audit_events")) throw new Error("audit insert failed");
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.createInitialAdminWithAudit({
      userId: "ADMIN-1", email: "admin@example.com",
      passwordHash: "scrypt$test", eventId: "EVENT-1", now: 1000
    }),
    /audit insert failed/
  );
  assert.ok(calls.some(call => call.sql === "ROLLBACK"));
  assert.ok(!calls.some(call => call.sql === "COMMIT"));
});

test("creates a session and its login audit event in one transaction", async () => {
  const { pool, calls } = createPool(async (sql, values) => {
    if (sql.includes("SELECT user_id FROM afri_human_users WHERE")) {
      return { rows: [{ user_id: values[0] }] };
    }
    if (sql.includes("INSERT INTO afri_human_sessions")) return { rows: [{
      session_id: values[0], user_id: values[1], token_hash: values[2],
      created_at: values[3], expires_at: values[4], revoked_at: null
    }] };
    if (sql.includes("INSERT INTO afri_identity_audit_events")) return { rows: [{
      event_id: values[0], actor_user_id: values[1], event_type: values[2],
      subject_user_id: values[3], outcome: values[4],
      details: JSON.parse(values[5]), created_at: values[6]
    }] };
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  const throttleKey = "d".repeat(64);
  const session = await repository.createSessionWithAudit({
    sessionId: "SESSION-1", userId: "USER-1", tokenHash: "a".repeat(64),
    createdAt: 1000, expiresAt: 2000, eventId: "EVENT-LOGIN-1",
    throttleKey
  });

  assert.equal(session.sessionId, "SESSION-1");
  const sql = calls.map(call => call.sql);
  assert.equal(sql[0], "BEGIN");
  assert.ok(sql.some(statement => statement.includes("FOR UPDATE")));
  assert.ok(sql.some(statement => statement.includes("INSERT INTO afri_identity_audit_events")));
  const throttleDeleteIndex = sql.findIndex(statement =>
    statement.includes("DELETE FROM afri_identity_login_attempts")
  );
  assert.ok(throttleDeleteIndex > 0);
  assert.ok(throttleDeleteIndex < sql.indexOf("COMMIT"));
  assert.deepEqual(calls[throttleDeleteIndex].values, [throttleKey]);
  assert.equal(sql.at(-1), "COMMIT");
});

test("enforces active login lockouts and protects them in the atomic upsert", async () => {
  const { pool, calls } = createPool(async () => ({
    rows: [{ attempt_count: 5, blocked_until: 20000 }]
  }));
  const repository = new AfriIdentityPostgresRepository({ pool });
  const throttleKey = "b".repeat(64);

  const result = await repository.checkLoginThrottle({
    throttleKey, now: 15000, windowMs: 1000
  });

  assert.deepEqual(result, {
    allowed: false, attemptCount: 5, blockedUntil: 20000
  });
  assert.match(calls[0].sql, /SELECT attempt_count, blocked_until/);

  await repository.recordLoginFailure({
    throttleKey, now: 15000, windowMs: 1000, maxAttempts: 5, blockMs: 1000
  });
  const upsert = calls.at(-1).sql;
  assert.equal((upsert.match(/blocked_until IS NULL/g) || []).length, 3);
  assert.equal((upsert.match(/blocked_until <= \$2/g) || []).length, 3);
  assert.equal((upsert.match(/window_started_at <= \$2 - \$3/g) || []).length, 3);
});


test("rolls back session creation when its login audit insert fails", async () => {
  const { pool, calls } = createPool(async (sql, values) => {
    if (sql.includes("SELECT user_id FROM afri_human_users WHERE")) {
      return { rows: [{ user_id: values[0] }] };
    }
    if (sql.includes("INSERT INTO afri_human_sessions")) {
      return { rows: [{
        session_id: values[0], user_id: values[1], token_hash: values[2],
        created_at: values[3], expires_at: values[4], revoked_at: null
      }] };
    }
    if (sql.includes("INSERT INTO afri_identity_audit_events")) {
      throw new Error("login audit insert failed");
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.createSessionWithAudit({
      sessionId: "SESSION-1", userId: "USER-1",
      tokenHash: "a".repeat(64), createdAt: 1000,
      expiresAt: 2000, eventId: "EVENT-LOGIN-1"
    }),
    /login audit insert failed/
  );
  assert.ok(calls.some(call => call.sql === "ROLLBACK"));
  assert.ok(!calls.some(call => call.sql === "COMMIT"));
});

test("rolls back session creation when transactional throttle clearing fails", async () => {
  const { pool, calls } = createPool(async (sql, values) => {
    if (sql.includes("SELECT user_id FROM afri_human_users WHERE")) {
      return { rows: [{ user_id: values[0] }] };
    }
    if (sql.includes("INSERT INTO afri_human_sessions")) {
      return { rows: [{
        session_id: values[0], user_id: values[1], token_hash: values[2],
        created_at: values[3], expires_at: values[4], revoked_at: null
      }] };
    }
    if (sql.includes("INSERT INTO afri_identity_audit_events")) {
      return { rows: [{
        event_id: values[0], actor_user_id: values[1], event_type: values[2],
        subject_user_id: values[3], outcome: values[4],
        details: JSON.parse(values[5]), created_at: values[6]
      }] };
    }
    if (sql.includes("DELETE FROM afri_identity_login_attempts")) {
      throw new Error("throttle clearing failed");
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.createSessionWithAudit({
      sessionId: "SESSION-2", userId: "USER-1",
      tokenHash: "e".repeat(64), createdAt: 1000,
      expiresAt: 2000, eventId: "EVENT-LOGIN-2",
      throttleKey: "f".repeat(64)
    }),
    /throttle clearing failed/
  );

  const sql = calls.map(call => call.sql);
  assert.ok(sql.some(statement => statement.includes("INSERT INTO afri_human_sessions")));
  assert.ok(sql.some(statement => statement.includes("DELETE FROM afri_identity_login_attempts")));
  assert.ok(sql.includes("ROLLBACK"));
  assert.ok(!sql.includes("COMMIT"));
});

test("clears persistent login attempts using the throttle key", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriIdentityPostgresRepository({ pool });
  const throttleKey = "c".repeat(64);

  assert.equal(await repository.clearLoginAttempts({ throttleKey }), true);
  assert.match(calls[0].sql, /DELETE FROM afri_identity_login_attempts WHERE throttle_key = \$1/);
  assert.deepEqual(calls[0].values, [throttleKey]);
});


test("recovers an active initial administrator atomically and consumes the recovery key", async () => {
  const { pool, calls } = createPool(async (sql) => {
    if (sql.includes("SELECT consumed_at")) {
      return { rows: [{ consumed_at: null }] };
    }
    if (sql.includes("SELECT u.user_id, u.email")) {
      return { rows: [{ user_id: "ADMIN-1", email: "admin@example.com" }] };
    }
    if (sql.includes("UPDATE afri_human_users")) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes("UPDATE afri_identity_recovery_uses") && sql.includes("SET consumed_at")) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes("INSERT INTO afri_identity_audit_events")) {
      return { rows: [{
        event_id: "EVENT-1",
        actor_user_id: null,
        event_type: "ADMIN_PASSWORD_RECOVERY",
        subject_user_id: "ADMIN-1",
        outcome: "SUCCESS",
        details: { method: "ONE_TIME_RECOVERY_SECRET" },
        created_at: 1000
      }] };
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  const user = await repository.recoverInitialAdminPasswordWithAudit({
    email: "Admin@Example.com",
    passwordHash: "scrypt$new-hash",
    recoveryKeyHash: "a".repeat(64),
    eventId: "EVENT-1",
    now: 1000
  });

  assert.deepEqual(user, { userId: "ADMIN-1", email: "admin@example.com" });
  const sql = calls.map(call => call.sql).join("\n");
  assert.match(sql, /INSERT INTO afri_identity_recovery_uses/);
  assert.match(sql, /SELECT consumed_at[\s\S]*FOR UPDATE/);
  assert.match(sql, /FOR UPDATE OF u/);
  assert.match(sql, /SET password_hash = \$2, updated_at = \$3/);
  assert.match(sql, /UPDATE afri_human_sessions[\s\S]*revoked_at = \$2/);
  assert.match(sql, /INSERT INTO afri_identity_audit_events/);
  assert.match(sql, /SET consumed_at = \$2/);
  assert.equal(calls[0].sql, "BEGIN");
  assert.equal(calls.at(-1).sql, "COMMIT");
  assert.equal(calls.some(call => call.sql === "ROLLBACK"), false);
});

test("rejects a previously consumed recovery key before looking up the administrator", async () => {
  const { pool, calls } = createPool(async (sql) => {
    if (sql.includes("SELECT consumed_at")) {
      return { rows: [{ consumed_at: 900 }] };
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.recoverInitialAdminPasswordWithAudit({
      email: "admin@example.com",
      passwordHash: "scrypt$new-hash",
      recoveryKeyHash: "b".repeat(64),
      eventId: "EVENT-2",
      now: 1000
    }),
    { message: "AFRI_IDENTITY_RECOVERY_ALREADY_USED" }
  );

  assert.equal(calls.some(call => call.sql.includes("SELECT u.user_id, u.email")), false);
  assert.equal(calls.at(-1).sql, "ROLLBACK");
});

test("rolls back password recovery when the recovery key cannot be consumed", async () => {
  const { pool, calls } = createPool(async (sql) => {
    if (sql.includes("SELECT consumed_at")) {
      return { rows: [{ consumed_at: null }] };
    }
    if (sql.includes("SELECT u.user_id, u.email")) {
      return { rows: [{ user_id: "ADMIN-1", email: "admin@example.com" }] };
    }
    if (sql.includes("UPDATE afri_human_users")) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes("UPDATE afri_identity_recovery_uses") && sql.includes("SET consumed_at")) {
      return { rows: [], rowCount: 0 };
    }
    if (sql.includes("INSERT INTO afri_identity_audit_events")) {
      return { rows: [{
        event_id: "EVENT-4",
        actor_user_id: null,
        event_type: "ADMIN_PASSWORD_RECOVERY",
        subject_user_id: "ADMIN-1",
        outcome: "SUCCESS",
        details: { method: "ONE_TIME_RECOVERY_SECRET" },
        created_at: 1000
      }] };
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.recoverInitialAdminPasswordWithAudit({
      email: "admin@example.com",
      passwordHash: "scrypt$new-hash",
      recoveryKeyHash: "d".repeat(64),
      eventId: "EVENT-4",
      now: 1000
    }),
    { message: "AFRI_IDENTITY_RECOVERY_CONSUMPTION_FAILED" }
  );

  assert.equal(calls.at(-1).sql, "ROLLBACK");
  assert.equal(calls.some(call => call.sql === "COMMIT"), false);
});

test("rolls back password recovery when audit insertion fails", async () => {
  const { pool, calls } = createPool(async (sql) => {
    if (sql.includes("SELECT consumed_at")) {
      return { rows: [{ consumed_at: null }] };
    }
    if (sql.includes("SELECT u.user_id, u.email")) {
      return { rows: [{ user_id: "ADMIN-1", email: "admin@example.com" }] };
    }
    if (sql.includes("UPDATE afri_human_users")) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes("INSERT INTO afri_identity_audit_events")) {
      throw new Error("audit write failed");
    }
    return { rows: [] };
  });
  const repository = new AfriIdentityPostgresRepository({ pool });

  await assert.rejects(
    repository.recoverInitialAdminPasswordWithAudit({
      email: "admin@example.com",
      passwordHash: "scrypt$new-hash",
      recoveryKeyHash: "c".repeat(64),
      eventId: "EVENT-3",
      now: 1000
    }),
    /audit write failed/
  );

  const sql = calls.map(call => call.sql).join("\n");
  assert.match(sql, /UPDATE afri_human_users/);
  assert.match(sql, /UPDATE afri_human_sessions/);
  assert.equal(calls.at(-1).sql, "ROLLBACK");
  assert.equal(calls.some(call => call.sql === "COMMIT"), false);
});
