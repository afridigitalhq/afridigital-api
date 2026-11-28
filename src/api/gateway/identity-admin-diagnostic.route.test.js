import test from "node:test";
import assert from "node:assert/strict";
import identityAdminDiagnosticRoute from "./identity-admin-diagnostic.route.js";

const secret = "s".repeat(48);

function setup({ runtime = {}, configuredSecret = secret } = {}) {
  const handlers = new Map();
  identityAdminDiagnosticRoute({
    post(path, handler) { handlers.set(path, handler); }
  }, {
    getIdentityRuntime: () => runtime,
    getRecoverySecret: () => configuredSecret
  });
  return handlers.get("/api/identity/admin-account-diagnostic");
}

async function invoke(handler, suppliedSecret = secret) {
  const res = {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; return this; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };

  await handler({
    get(name) {
      return name.toLowerCase() === "x-afri-identity-diagnostic-secret"
        ? suppliedSecret
        : undefined;
    }
  }, res);

  return res;
}

test("fails closed when recovery secret is not configured", async () => {
  const handler = setup({ configuredSecret: "" });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.payload, {
    status: "DIAGNOSTIC_SECRET_NOT_CONFIGURED"
  });
});

test("rejects an invalid secret without accessing identity data", async () => {
  let accessed = false;
  const handler = setup({
    runtime: {
      repository: {
        async findUserByEmail() {
          accessed = true;
          return null;
        }
      }
    }
  });

  const res = await invoke(handler, "wrong");
  assert.equal(res.statusCode, 404);
  assert.equal(accessed, false);
});

test("returns only account status, hash format, and role assignment", async () => {
  const passwordHash =
    "scrypt$16384$8$1$" + "a".repeat(32) + "$" + "b".repeat(128);

  const handler = setup({
    runtime: {
      repository: {
        async findUserByEmail(email) {
          assert.equal(email, "afridigitalhq@gmail.com");
          return {
            userId: "internal-id",
            status: "ACTIVE",
            passwordHash
          };
        },
        async listUserRoles(userId) {
          assert.equal(userId, "internal-id");
          return ["AFRIAI_DIAGNOSTICS_ADMIN"];
        }
      }
    }
  });

  const res = await invoke(handler);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, {
    status: "INSPECTED",
    account: "FOUND",
    accountStatus: "ACTIVE",
    passwordHashFormat: "CURRENT_SCRYPT_FORMAT",
    diagnosticsAdminRole: true
  });
  assert.equal(JSON.stringify(res.payload).includes(passwordHash), false);
  assert.equal(res.headers["Cache-Control"], "no-store");
});

test("reports a missing account without exposing other user data", async () => {
  const handler = setup({
    runtime: {
      repository: {
        async findUserByEmail() { return null; }
      }
    }
  });

  const res = await invoke(handler);

  assert.deepEqual(res.payload, {
    status: "INSPECTED",
    account: "NOT_FOUND",
    accountStatus: null,
    passwordHashFormat: null,
    diagnosticsAdminRole: false
  });
});
