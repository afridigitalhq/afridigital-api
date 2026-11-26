const CREATE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS afri_human_users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS afri_human_user_roles (
  user_id TEXT NOT NULL REFERENCES afri_human_users(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  assigned_at BIGINT NOT NULL,
  PRIMARY KEY (user_id, role)
);
CREATE TABLE IF NOT EXISTS afri_human_sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES afri_human_users(user_id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  revoked_at BIGINT,
  CHECK (expires_at > created_at)
);
CREATE INDEX IF NOT EXISTS idx_afri_human_sessions_user
  ON afri_human_sessions (user_id, expires_at);
CREATE TABLE IF NOT EXISTS afri_identity_audit_events (
  event_id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  event_type TEXT NOT NULL,
  subject_user_id TEXT,
  outcome TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_afri_identity_audit_created
  ON afri_identity_audit_events (created_at);
CREATE TABLE IF NOT EXISTS afri_identity_login_attempts (
  throttle_key CHAR(64) PRIMARY KEY,
  window_started_at BIGINT NOT NULL,
  attempt_count INTEGER NOT NULL CHECK (attempt_count >= 0),
  blocked_until BIGINT,
  updated_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_afri_identity_login_attempts_updated
  ON afri_identity_login_attempts (updated_at);
CREATE TABLE IF NOT EXISTS afri_identity_recovery_uses (
  recovery_key_hash CHAR(64) PRIMARY KEY,
  created_at BIGINT NOT NULL,
  consumed_at BIGINT
);
`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/i;

function requiredText(value, code) {
  if (typeof value !== "string" || !value.trim()) throw new Error(code);
  return value.trim();
}

function requiredTimestamp(value, code) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(code);
  return value;
}

function validateAuditDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_INVALID");
  const visit = (value, depth = 0) => {
    if (depth > 8) throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_INVALID");
    if (Array.isArray(value)) return value.forEach(item => visit(item, depth + 1));
    if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) {
      if (/(password|token|secret|authorization|cookie|credential|private.?key|api.?key)/i.test(key)) throw new Error("AFRI_IDENTITY_AUDIT_SENSITIVE_FIELD");
      visit(item, depth + 1);
    }
    else if (typeof value === "number" && !Number.isFinite(value)) throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_INVALID");
    else if (value !== null && !["string", "number", "boolean", "undefined"].includes(typeof value)) throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_INVALID");
  };
  visit(details);
  let serialized;
  try { serialized = JSON.stringify(details); } catch { throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_INVALID"); }
  if (typeof serialized !== "string" || Buffer.byteLength(serialized, "utf8") > 8192) throw new Error("AFRI_IDENTITY_AUDIT_DETAILS_TOO_LARGE");
  return serialized;
}

function mapUser(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    email: row.email,
    passwordHash: row.password_hash,
    status: row.status,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at)
  };
}

function mapSession(row) {
  if (!row) return null;
  return {
    sessionId: row.session_id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    revokedAt: row.revoked_at === null ? null : Number(row.revoked_at)
  };
}

export class AfriIdentityPostgresRepository {
  constructor({ pool } = {}) {
    if (!pool || typeof pool.query !== "function") {
      throw new Error("AFRI_IDENTITY_POSTGRES_POOL_REQUIRED");
    }
    this.pool = pool;
    this.initialization = null;
  }

  async initialize() {
    if (this.initialization) return this.initialization;
    this.initialization = this.pool.query(CREATE_SCHEMA_SQL).then(() => true);
    try {
      return await this.initialization;
    } catch (error) {
      this.initialization = null;
      throw error;
    }
  }

  async createInitialAdminWithAudit({ userId, email, passwordHash, eventId, now = Date.now() } = {}) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    email = requiredText(email, "AFRI_IDENTITY_EMAIL_REQUIRED").toLowerCase();
    passwordHash = requiredText(passwordHash, "AFRI_IDENTITY_PASSWORD_HASH_REQUIRED");
    eventId = requiredText(eventId, "AFRI_IDENTITY_AUDIT_ID_REQUIRED");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!EMAIL_PATTERN.test(email)) throw new Error("AFRI_IDENTITY_EMAIL_INVALID");
    if (passwordHash.length > 512) throw new Error("AFRI_IDENTITY_PASSWORD_HASH_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "SELECT pg_advisory_xact_lock(hashtext($1))",
        ["afri-identity-initial-admin-bootstrap"]
      );
      const existing = await client.query("SELECT user_id FROM afri_human_users LIMIT 1");
      if (existing.rows.length) throw new Error("AFRI_IDENTITY_BOOTSTRAP_ALREADY_COMPLETED");

      const inserted = await client.query(
        `INSERT INTO afri_human_users
          (user_id, email, password_hash, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'ACTIVE', $4, $4) RETURNING *`,
        [userId, email, passwordHash, now]
      );
      const user = mapUser(inserted.rows[0]);
      await client.query(
        "INSERT INTO afri_human_user_roles (user_id, role, assigned_at) VALUES ($1, $2, $3)",
        [userId, "AFRIAI_DIAGNOSTICS_ADMIN", now]
      );
      await this.appendAuditEvent({
        eventId,
        eventType: "INITIAL_ADMIN_BOOTSTRAPPED",
        subjectUserId: userId,
        outcome: "SUCCESS",
        details: { role: "AFRIAI_DIAGNOSTICS_ADMIN" },
        createdAt: now,
        client
      });
      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async recoverInitialAdminPasswordWithAudit({
    email, passwordHash, recoveryKeyHash, eventId, now = Date.now()
  } = {}) {
    email = requiredText(email, "AFRI_IDENTITY_EMAIL_REQUIRED").toLowerCase();
    passwordHash = requiredText(passwordHash, "AFRI_IDENTITY_PASSWORD_HASH_REQUIRED");
    recoveryKeyHash = requiredText(recoveryKeyHash, "AFRI_IDENTITY_RECOVERY_KEY_INVALID").toLowerCase();
    eventId = requiredText(eventId, "AFRI_IDENTITY_AUDIT_ID_REQUIRED");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");

    if (!EMAIL_PATTERN.test(email)) throw new Error("AFRI_IDENTITY_EMAIL_INVALID");
    if (passwordHash.length > 512) throw new Error("AFRI_IDENTITY_PASSWORD_HASH_INVALID");
    if (!HASH_PATTERN.test(recoveryKeyHash)) throw new Error("AFRI_IDENTITY_RECOVERY_KEY_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO afri_identity_recovery_uses (recovery_key_hash, created_at)
         VALUES ($1, $2) ON CONFLICT (recovery_key_hash) DO NOTHING`,
        [recoveryKeyHash, now]
      );

      const recoveryUse = await client.query(
        `SELECT consumed_at FROM afri_identity_recovery_uses
         WHERE recovery_key_hash = $1 FOR UPDATE`,
        [recoveryKeyHash]
      );
      if (!recoveryUse.rows.length || recoveryUse.rows[0].consumed_at !== null) {
        throw new Error("AFRI_IDENTITY_RECOVERY_ALREADY_USED");
      }

      const admin = await client.query(
        `SELECT u.user_id, u.email
         FROM afri_human_users u
         JOIN afri_human_user_roles r ON r.user_id = u.user_id
         WHERE u.email = $1
           AND u.status = 'ACTIVE'
           AND r.role = 'AFRIAI_DIAGNOSTICS_ADMIN'
         FOR UPDATE OF u, r`,
        [email]
      );
      if (!admin.rows.length) throw new Error("AFRI_IDENTITY_RECOVERY_ADMIN_NOT_FOUND");

      const user = admin.rows[0];
      const passwordUpdate = await client.query(
        `UPDATE afri_human_users
         SET password_hash = $2, updated_at = $3
         WHERE user_id = $1`,
        [user.user_id, passwordHash, now]
      );
      if (passwordUpdate.rowCount !== 1) {
        throw new Error("AFRI_IDENTITY_RECOVERY_ADMIN_UPDATE_FAILED");
      }

      await client.query(
        `UPDATE afri_human_sessions
         SET revoked_at = $2
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [user.user_id, now]
      );

      await this.appendAuditEvent({
        eventId,
        eventType: "ADMIN_PASSWORD_RECOVERY",
        subjectUserId: user.user_id,
        outcome: "SUCCESS",
        details: { method: "ONE_TIME_RECOVERY_SECRET" },
        createdAt: now,
        client
      });

      const recoveryConsumption = await client.query(
        `UPDATE afri_identity_recovery_uses
         SET consumed_at = $2
         WHERE recovery_key_hash = $1 AND consumed_at IS NULL`,
        [recoveryKeyHash, now]
      );
      if (recoveryConsumption.rowCount !== 1) {
        throw new Error("AFRI_IDENTITY_RECOVERY_CONSUMPTION_FAILED");
      }

      await client.query("COMMIT");
      return { userId: user.user_id, email: user.email };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async createSessionWithAudit({ sessionId, userId, tokenHash, createdAt = Date.now(), expiresAt, eventId, throttleKey } = {}) {
    sessionId = requiredText(sessionId, "AFRI_IDENTITY_SESSION_ID_REQUIRED");
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    tokenHash = requiredText(tokenHash, "AFRI_IDENTITY_TOKEN_HASH_REQUIRED").toLowerCase();
    eventId = requiredText(eventId, "AFRI_IDENTITY_AUDIT_ID_REQUIRED");
    if (!HASH_PATTERN.test(tokenHash)) throw new Error("AFRI_IDENTITY_TOKEN_HASH_INVALID");
    if (throttleKey !== undefined) {
      throttleKey = requiredText(throttleKey, "AFRI_IDENTITY_THROTTLE_KEY_REQUIRED").toLowerCase();
      if (!HASH_PATTERN.test(throttleKey)) throw new Error("AFRI_IDENTITY_THROTTLE_KEY_INVALID");
    }
    requiredTimestamp(createdAt, "AFRI_IDENTITY_SESSION_CREATED_AT_INVALID");
    requiredTimestamp(expiresAt, "AFRI_IDENTITY_SESSION_EXPIRY_INVALID");
    if (expiresAt <= createdAt) throw new Error("AFRI_IDENTITY_SESSION_EXPIRY_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const user = await client.query(
        "SELECT user_id FROM afri_human_users WHERE user_id = $1 AND status = $2 FOR UPDATE",
        [userId, "ACTIVE"]
      );
      if (!user.rows.length) throw new Error("AFRI_IDENTITY_USER_NOT_ACTIVE");
      const result = await client.query(
        `INSERT INTO afri_human_sessions
          (session_id, user_id, token_hash, created_at, expires_at)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [sessionId, userId, tokenHash, createdAt, expiresAt]
      );
      await this.appendAuditEvent({
        eventId,
        actorUserId: userId,
        eventType: "IDENTITY_LOGIN",
        subjectUserId: userId,
        outcome: "SUCCESS",
        details: {},
        createdAt,
        client
      });
      if (throttleKey !== undefined) {
        await client.query(
          "DELETE FROM afri_identity_login_attempts WHERE throttle_key = $1",
          [throttleKey]
        );
      }
      await client.query("COMMIT");
      return mapSession(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async checkLoginThrottle({ throttleKey, now = Date.now(), windowMs = 900000 } = {}) {
    throttleKey = requiredText(throttleKey, "AFRI_IDENTITY_THROTTLE_KEY_REQUIRED").toLowerCase();
    if (!HASH_PATTERN.test(throttleKey)) throw new Error("AFRI_IDENTITY_THROTTLE_KEY_INVALID");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!Number.isSafeInteger(windowMs) || windowMs < 1000) {
      throw new Error("AFRI_IDENTITY_THROTTLE_CONFIG_INVALID");
    }

    const result = await this.pool.query(
      `SELECT attempt_count, blocked_until
       FROM afri_identity_login_attempts
       WHERE throttle_key = $1`,
      [throttleKey]
    );
    const row = result.rows[0];
    if (!row) return { allowed: true, attemptCount: 0, blockedUntil: null };

    const blockedUntil = row.blocked_until === null ? null : Number(row.blocked_until);
    const currentlyBlocked = blockedUntil !== null && blockedUntil > now;

    return {
      allowed: !currentlyBlocked,
      attemptCount: Number(row.attempt_count),
      blockedUntil: currentlyBlocked ? blockedUntil : null
    };
  }

  async recordLoginFailure({
    throttleKey,
    now = Date.now(),
    windowMs = 900000,
    maxAttempts = 5,
    blockMs = 900000
  } = {}) {
    throttleKey = requiredText(throttleKey, "AFRI_IDENTITY_THROTTLE_KEY_REQUIRED").toLowerCase();
    if (!HASH_PATTERN.test(throttleKey)) throw new Error("AFRI_IDENTITY_THROTTLE_KEY_INVALID");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!Number.isSafeInteger(windowMs) || windowMs < 1000 ||
        !Number.isSafeInteger(maxAttempts) || maxAttempts < 1 ||
        !Number.isSafeInteger(blockMs) || blockMs < 1000) {
      throw new Error("AFRI_IDENTITY_THROTTLE_CONFIG_INVALID");
    }

    const result = await this.pool.query(
      `INSERT INTO afri_identity_login_attempts
        (throttle_key, window_started_at, attempt_count, blocked_until, updated_at)
       VALUES ($1, $2, 1, NULL, $2)
       ON CONFLICT (throttle_key) DO UPDATE SET
         window_started_at = CASE
           WHEN (afri_identity_login_attempts.blocked_until IS NOT NULL
                 AND afri_identity_login_attempts.blocked_until <= $2)
             OR (afri_identity_login_attempts.blocked_until IS NULL
                 AND afri_identity_login_attempts.window_started_at <= $2 - $3)
             THEN $2
           ELSE afri_identity_login_attempts.window_started_at
         END,
         attempt_count = CASE
           WHEN (afri_identity_login_attempts.blocked_until IS NOT NULL
                 AND afri_identity_login_attempts.blocked_until <= $2)
             OR (afri_identity_login_attempts.blocked_until IS NULL
                 AND afri_identity_login_attempts.window_started_at <= $2 - $3)
             THEN 1
           ELSE afri_identity_login_attempts.attempt_count + 1
         END,
         blocked_until = CASE
           WHEN (afri_identity_login_attempts.blocked_until IS NOT NULL
                 AND afri_identity_login_attempts.blocked_until <= $2)
             OR (afri_identity_login_attempts.blocked_until IS NULL
                 AND afri_identity_login_attempts.window_started_at <= $2 - $3)
             THEN NULL
           WHEN afri_identity_login_attempts.attempt_count + 1 >= $4
             THEN $2 + $5
           ELSE NULL
         END,
         updated_at = $2
       RETURNING attempt_count, blocked_until`,
      [throttleKey, now, windowMs, maxAttempts, blockMs]
    );
    const row = result.rows[0];
    if (!row) throw new Error("AFRI_IDENTITY_THROTTLE_RESULT_MISSING");
    const blockedUntil = row.blocked_until === null ? null : Number(row.blocked_until);
    return {
      allowed: blockedUntil === null || blockedUntil <= now,
      attemptCount: Number(row.attempt_count),
      blockedUntil
    };
  }

  async clearLoginAttempts({ throttleKey } = {}) {
    throttleKey = requiredText(throttleKey, "AFRI_IDENTITY_THROTTLE_KEY_REQUIRED").toLowerCase();
    if (!HASH_PATTERN.test(throttleKey)) throw new Error("AFRI_IDENTITY_THROTTLE_KEY_INVALID");
    await this.pool.query(
      "DELETE FROM afri_identity_login_attempts WHERE throttle_key = $1",
      [throttleKey]
    );
    return true;
  }

  async createUser({ userId, email, passwordHash, now = Date.now() } = {}) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    email = requiredText(email, "AFRI_IDENTITY_EMAIL_REQUIRED").toLowerCase();
    passwordHash = requiredText(passwordHash, "AFRI_IDENTITY_PASSWORD_HASH_REQUIRED");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!EMAIL_PATTERN.test(email)) throw new Error("AFRI_IDENTITY_EMAIL_INVALID");
    if (passwordHash.length > 512) throw new Error("AFRI_IDENTITY_PASSWORD_HASH_INVALID");

    const result = await this.pool.query(
      `INSERT INTO afri_human_users
       (user_id, email, password_hash, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'ACTIVE', $4, $4) RETURNING *`,
      [userId, email, passwordHash, now]
    );
    return mapUser(result.rows[0]);
  }

  async findUserByEmail(email) {
    email = requiredText(email, "AFRI_IDENTITY_EMAIL_REQUIRED").toLowerCase();
    const result = await this.pool.query(
      "SELECT * FROM afri_human_users WHERE email = $1",
      [email]
    );
    return mapUser(result.rows[0]);
  }

  async findUserById(userId) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    const result = await this.pool.query(
      "SELECT * FROM afri_human_users WHERE user_id = $1",
      [userId]
    );
    return mapUser(result.rows[0]);
  }

  async setUserStatus(userId, status, now = Date.now()) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!["ACTIVE", "SUSPENDED", "REVOKED"].includes(status)) throw new Error("AFRI_IDENTITY_STATUS_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        "UPDATE afri_human_users SET status = $2, updated_at = $3 WHERE user_id = $1 RETURNING *",
        [userId, status, now]
      );
      if (!result.rows.length) throw new Error("AFRI_IDENTITY_USER_NOT_FOUND");
      if (status !== "ACTIVE") {
        await client.query(
          "UPDATE afri_human_sessions SET revoked_at = $2 WHERE user_id = $1 AND revoked_at IS NULL",
          [userId, now]
        );
      }
      await client.query("COMMIT");
      return mapUser(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async replaceUserRoles(userId, roles, now = Date.now()) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (!Array.isArray(roles) || roles.length > 32 || roles.some(role => typeof role !== "string" || !/^[A-Z][A-Z0-9_]{1,63}$/.test(role))) throw new Error("AFRI_IDENTITY_ROLES_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");
    const client = await this.pool.connect();
    const uniqueRoles = [...new Set(roles)];
    try {
      await client.query("BEGIN");
      const exists = await client.query("SELECT user_id FROM afri_human_users WHERE user_id = $1 FOR UPDATE", [userId]);
      if (!exists.rows.length) throw new Error("AFRI_IDENTITY_USER_NOT_FOUND");
      await client.query("DELETE FROM afri_human_user_roles WHERE user_id = $1", [userId]);
      for (const role of uniqueRoles) await client.query(
        "INSERT INTO afri_human_user_roles (user_id, role, assigned_at) VALUES ($1, $2, $3)",
        [userId, role, now]
      );
      await client.query("COMMIT");
      return uniqueRoles;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async listUserRoles(userId) {
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    const result = await this.pool.query(
      "SELECT role FROM afri_human_user_roles WHERE user_id = $1 ORDER BY role",
      [userId]
    );
    return result.rows.map(row => row.role);
  }

  async createSession({ sessionId, userId, tokenHash, createdAt = Date.now(), expiresAt } = {}) {
    sessionId = requiredText(sessionId, "AFRI_IDENTITY_SESSION_ID_REQUIRED");
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    tokenHash = requiredText(tokenHash, "AFRI_IDENTITY_TOKEN_HASH_REQUIRED").toLowerCase();
    if (!HASH_PATTERN.test(tokenHash)) throw new Error("AFRI_IDENTITY_TOKEN_HASH_INVALID");
    requiredTimestamp(createdAt, "AFRI_IDENTITY_SESSION_CREATED_AT_INVALID");
    requiredTimestamp(expiresAt, "AFRI_IDENTITY_SESSION_EXPIRY_INVALID");
    if (expiresAt <= createdAt) throw new Error("AFRI_IDENTITY_SESSION_EXPIRY_INVALID");
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_IDENTITY_TRANSACTION_REQUIRED");
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const user = await client.query(
        "SELECT user_id FROM afri_human_users WHERE user_id = $1 AND status = $2 FOR UPDATE",
        [userId, "ACTIVE"]
      );
      if (!user.rows.length) throw new Error("AFRI_IDENTITY_USER_NOT_ACTIVE");
      const result = await client.query(
        "INSERT INTO afri_human_sessions (session_id, user_id, token_hash, created_at, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [sessionId, userId, tokenHash, createdAt, expiresAt]
      );
      await client.query("COMMIT");
      return mapSession(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async findActiveSessionByTokenHash(tokenHash, now = Date.now()) {
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    tokenHash = requiredText(tokenHash, "AFRI_IDENTITY_TOKEN_HASH_REQUIRED").toLowerCase();
    if (!HASH_PATTERN.test(tokenHash)) return null;
    const result = await this.pool.query(
      `SELECT s.* FROM afri_human_sessions s
       JOIN afri_human_users u ON u.user_id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL
         AND s.expires_at > $2 AND u.status = 'ACTIVE'`,
      [tokenHash, now]
    );
    return mapSession(result.rows[0]);
  }

  async findActiveSessionById(sessionId, now = Date.now()) {
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    sessionId = requiredText(sessionId, "AFRI_IDENTITY_SESSION_ID_REQUIRED");
    const result = await this.pool.query(
      "SELECT s.* FROM afri_human_sessions s JOIN afri_human_users u ON u.user_id = s.user_id WHERE s.session_id = $1 AND s.revoked_at IS NULL AND s.expires_at > $2 AND u.status = $3",
      [sessionId, now, "ACTIVE"]
    );
    return mapSession(result.rows[0]);
  }

  async revokeSession(sessionId, now = Date.now()) {
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    sessionId = requiredText(sessionId, "AFRI_IDENTITY_SESSION_ID_REQUIRED");
    const result = await this.pool.query(
      `UPDATE afri_human_sessions SET revoked_at = $2
       WHERE session_id = $1 AND revoked_at IS NULL RETURNING *`,
      [sessionId, now]
    );
    return mapSession(result.rows[0]);
  }

  async revokeUserSessions(userId, now = Date.now()) {
    requiredTimestamp(now, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    userId = requiredText(userId, "AFRI_IDENTITY_USER_ID_REQUIRED");
    const result = await this.pool.query(
      `UPDATE afri_human_sessions SET revoked_at = $2
       WHERE user_id = $1 AND revoked_at IS NULL RETURNING session_id`,
      [userId, now]
    );
    return result.rows.length;
  }

  async appendAuditEvent({
    eventId, actorUserId = null, eventType, subjectUserId = null,
    outcome, details = {}, createdAt = Date.now(), client = null
  } = {}) {
    eventId = requiredText(eventId, "AFRI_IDENTITY_AUDIT_ID_REQUIRED");
    requiredTimestamp(createdAt, "AFRI_IDENTITY_TIMESTAMP_INVALID");
    if (actorUserId !== null) actorUserId = requiredText(actorUserId, "AFRI_IDENTITY_ACTOR_USER_ID_INVALID");
    if (subjectUserId !== null) subjectUserId = requiredText(subjectUserId, "AFRI_IDENTITY_SUBJECT_USER_ID_INVALID");
    eventType = requiredText(eventType, "AFRI_IDENTITY_AUDIT_TYPE_REQUIRED");
    outcome = requiredText(outcome, "AFRI_IDENTITY_AUDIT_OUTCOME_REQUIRED");
    const serializedDetails = validateAuditDetails(details);
    const queryClient = client ?? this.pool;
    if (!queryClient || typeof queryClient.query !== "function") {
      throw new Error("AFRI_IDENTITY_AUDIT_CLIENT_INVALID");
    }
    const result = await queryClient.query(
      `INSERT INTO afri_identity_audit_events
       (event_id, actor_user_id, event_type, subject_user_id, outcome, details, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7) RETURNING *`,
      [eventId, actorUserId, eventType, subjectUserId, outcome, serializedDetails, createdAt]
    );
    const row = result.rows[0];
    return {
      eventId: row.event_id,
      actorUserId: row.actor_user_id,
      eventType: row.event_type,
      subjectUserId: row.subject_user_id,
      outcome: row.outcome,
      details: row.details,
      createdAt: Number(row.created_at)
    };
  }
}

export default AfriIdentityPostgresRepository;
