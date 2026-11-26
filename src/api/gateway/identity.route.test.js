import test from "node:test";
import assert from "node:assert/strict";
import identityRoute from "./identity.route.js";

function setup({ runtime, secret = "test-bootstrap-secret", getIdentityRuntime } = {}) {
  const handlers = new Map();
  const app = {
    post(path, handler) {
      assert.equal(typeof handler, "function");
      handlers.set(path, handler);
    }
  };
  identityRoute(app, {
    getIdentityRuntime: getIdentityRuntime || (() => runtime),
    getBootstrapSecret: () => secret
  });
  return handlers;
}

async function invoke(handler, { body, headers = {} } = {}) {
  const response = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
  const request = {
    body,
    headers,
    get(name) {
      return headers[name.toLowerCase()];
    }
  };
  await handler(request, response);
  return response;
}

function passwordService({ valid = true } = {}) {
  return {
    constructor: {
      async hash() {
        return "scrypt$test-hash";
      },
      async verify() {
        return valid;
      }
    }
  };
}

test("registers both identity POST handlers", () => {
  const handlers = setup({ runtime: {} });
  assert.equal(typeof handlers.get("/api/identity/bootstrap-admin"), "function");
  assert.equal(typeof handlers.get("/api/identity/login"), "function");
});

test("hides bootstrap endpoint when the supplied secret is invalid", async () => {
  let runtimeAccessed = false;
  const handlers = setup({
    getIdentityRuntime() {
      runtimeAccessed = true;
      return {};
    },
    secret: "correct-secret"
  });
  const response = await invoke(handlers.get("/api/identity/bootstrap-admin"), {
    body: { email: "admin@example.com", password: "long-enough-password" },
    headers: { "x-afri-bootstrap-secret": "wrong-secret" }
  });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.payload, { error: "NOT_FOUND" });
  assert.equal(runtimeAccessed, false);
});

test("creates the initial admin only after validating the bootstrap secret", async () => {
  let input;
  const runtime = {
    passwordService: passwordService(),
    repository: {
      async createInitialAdminWithAudit(value) {
        input = value;
        return {
          userId: value.userId,
          email: value.email,
          status: "ACTIVE"
        };
      }
    }
  };
  const handlers = setup({ runtime, secret: "correct-secret" });

  const response = await invoke(handlers.get("/api/identity/bootstrap-admin"), {
    body: { email: " Admin@Example.com ", password: "long-enough-password" },
    headers: { "x-afri-bootstrap-secret": "correct-secret" }
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.payload.status, "INITIAL_ADMIN_CREATED");
  assert.equal(response.payload.user.email, "admin@example.com");
  assert.equal(input.email, "admin@example.com");
  assert.match(input.userId, /^[0-9a-f-]{36}$/i);
  assert.match(input.eventId, /^[0-9a-f-]{36}$/i);
  assert.equal(input.passwordHash, "scrypt$test-hash");
});

test("returns a conflict when initial-admin provisioning has already completed", async () => {
  const runtime = {
    passwordService: passwordService(),
    repository: {
      async createInitialAdminWithAudit() {
        throw new Error("AFRI_IDENTITY_BOOTSTRAP_ALREADY_COMPLETED");
      }
    }
  };
  const handlers = setup({ runtime });
  const response = await invoke(handlers.get("/api/identity/bootstrap-admin"), {
    body: { email: "admin@example.com", password: "long-enough-password" },
    headers: { "x-afri-bootstrap-secret": "test-bootstrap-secret" }
  });

  assert.equal(response.statusCode, 409);
  assert.deepEqual(response.payload, { error: "BOOTSTRAP_ALREADY_COMPLETED" });
});

test("rejects login before user lookup when the persistent throttle is active", async () => {
  let userLookup = false;
  const runtime = {
    passwordService: passwordService(),
    repository: {
      async checkLoginThrottle() {
        return { allowed: false, attemptCount: 5, blockedUntil: Date.now() + 60000 };
      },
      async findUserByEmail() {
        userLookup = true;
        return null;
      }
    }
  };
  const handlers = setup({ runtime });
  const response = await invoke(handlers.get("/api/identity/login"), {
    body: { email: "user@example.com", password: "wrong-password" }
  });

  assert.equal(response.statusCode, 429);
  assert.deepEqual(response.payload, { error: "LOGIN_TEMPORARILY_BLOCKED" });
  assert.equal(userLookup, false);
});

test("records failed login attempts without disclosing whether the account exists", async () => {
  let failureInput;
  const runtime = {
    passwordService: passwordService({ valid: false }),
    repository: {
      async checkLoginThrottle() {
        return { allowed: true, attemptCount: 0, blockedUntil: null };
      },
      async findUserByEmail() {
        return {
          userId: "USER-1",
          email: "user@example.com",
          passwordHash: "stored-hash",
          status: "ACTIVE"
        };
      },
      async recordLoginFailure(input) {
        failureInput = input;
        return { allowed: true, attemptCount: 1, blockedUntil: null };
      }
    }
  };
  const handlers = setup({ runtime });
  const response = await invoke(handlers.get("/api/identity/login"), {
    body: { email: "user@example.com", password: "incorrect-password" }
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.payload, { error: "CREDENTIALS_INVALID" });
  assert.match(failureInput.throttleKey, /^[a-f0-9]{64}$/);
  assert.notEqual(failureInput.throttleKey, "user@example.com");
});

test("issues an audited session after successful login and clears persistent failures", async () => {
  let auditOptions;
  const runtime = {
    passwordService: passwordService(),
    repository: {
      async checkLoginThrottle() {
        return { allowed: true, attemptCount: 0, blockedUntil: null };
      },
      async findUserByEmail(email) {
        return {
          userId: "USER-1",
          email,
          passwordHash: "stored-hash",
          status: "ACTIVE"
        };
      },
      async listUserRoles() {
        return ["AFRIAI_DIAGNOSTICS_ADMIN"];
      },
    },
    sessionService: {
      async create(userId, options) {
        auditOptions = options;
        assert.equal(userId, "USER-1");
        return { token: "issued-session-token", expiresAt: 999999 };
      }
    }
  };
  const handlers = setup({ runtime });
  const response = await invoke(handlers.get("/api/identity/login"), {
    body: { email: "User@Example.com", password: "correct-password" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.token, "issued-session-token");
  assert.deepEqual(response.payload.user.roles, ["AFRIAI_DIAGNOSTICS_ADMIN"]);
  assert.match(auditOptions.auditEventId, /^[0-9a-f-]{36}$/i);
  assert.match(auditOptions.throttleKey, /^[a-f0-9]{64}$/);
});
