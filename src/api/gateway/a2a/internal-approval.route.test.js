import test from "node:test";
import assert from "node:assert/strict";
import internalApprovalRoute from "./internal-approval.route.js";

function setup(getRuntime) {
  const handlers = new Map();
  const app = {
    post(path, ...middleware) {
      handlers.set(`POST ${path}`, middleware);
    }
  };
  internalApprovalRoute(app, { getRuntime });
  return handlers;
}

function responseHarness() {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  return {
    statusCode: 200,
    body: null,
    done,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; finish(); return this; }
  };
}

async function invoke(handlers, key, req) {
  const stack = handlers.get(key);
  assert.ok(stack, `route not registered: ${key}`);
  const res = responseHarness();
  await stack[1](req, res, () => stack[2](req, res));
  await res.done;
  return res;
}

const token = "a".repeat(40);
const uuid = "123e4567-e89b-42d3-a456-426614174000";

function runtimeFor(principal) {
  const calls = {};
  const sessionService = {
    async authenticate(value) {
      calls.token = value;
      return { userId: "UNVERIFIED-USER" };
    },
    async verifyPrincipal(value) {
      calls.rawPrincipal = value;
      return principal;
    }
  };
  const authority = {
    async approve(input) {
      calls.approve = input;
      return { approvalId: input.approvalId, status: "APPROVED" };
    },
    async reject(input) {
      calls.reject = input;
      return { approvalId: input.approvalId, status: "REJECTED" };
    },
    async request(input) {
      calls.request = input;
      return { approvalId: uuid, status: "PENDING" };
    }
  };
  return {
    calls,
    runtime: {
      sessionService,
      authority,
      commandRuntime: {
        async executeApproved(input) {
          calls.execute = input;
          return { status: "COMPLETED" };
        }
      }
    }
  };
}

test("approval endpoints fail closed before runtime initialization", async () => {
  const handlers = setup(() => {
    throw new Error("AFRI_AGENT_APPROVAL_RUNTIME_NOT_INITIALIZED");
  });
  const res = await invoke(handlers, "POST /api/a2a/internal/approvals", {
    headers: {}, body: {}
  });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.error.code, "AFRI_AGENT_APPROVAL_RUNTIME_NOT_INITIALIZED");
});

test("approval endpoints reject missing bearer authentication", async () => {
  const { runtime } = runtimeFor({ userId: "USER-1", roles: [] });
  const handlers = setup(() => runtime);
  const res = await invoke(handlers, "POST /api/a2a/internal/approvals/:approvalId/approve", {
    headers: { authorization: "Basic invalid" },
    params: { approvalId: uuid },
    body: {}
  });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error.code, "AFRI_IDENTITY_AUTHENTICATION_REQUIRED");
});

test("approval action binds approver identity to the verified principal", async () => {
  const principal = Object.freeze({ userId: "VERIFIED-ADMIN", roles: ["AGENT_APPROVER"] });
  const { runtime, calls } = runtimeFor(principal);
  const handlers = setup(() => runtime);
  const res = await invoke(handlers, "POST /api/a2a/internal/approvals/:approvalId/approve", {
    headers: { authorization: `Bearer ${token}` },
    params: { approvalId: uuid },
    body: { approverId: "ATTACKER-CONTROLLED-ID" }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(calls.token, token);
  assert.equal(calls.approve.approverId, "VERIFIED-ADMIN");
  assert.equal(calls.approve.principal, principal);
  assert.equal(calls.approve.approvalId, uuid);
  assert.equal(res.body.approval.status, "APPROVED");
});

test("approval rejection validates identifier and reason length", async () => {
  const principal = Object.freeze({ userId: "VERIFIED-ADMIN", roles: ["AGENT_APPROVER"] });
  const { runtime, calls } = runtimeFor(principal);
  const handlers = setup(() => runtime);
  const invalidId = await invoke(handlers, "POST /api/a2a/internal/approvals/:approvalId/reject", {
    headers: { authorization: `Bearer ${token}` },
    params: { approvalId: "not-a-uuid" },
    body: {}
  });
  assert.equal(invalidId.statusCode, 400);
  assert.equal(invalidId.body.error.code, "AFRI_APPROVAL_ID_INVALID");

  const invalidReason = await invoke(handlers, "POST /api/a2a/internal/approvals/:approvalId/reject", {
    headers: { authorization: `Bearer ${token}` },
    params: { approvalId: uuid },
    body: { reason: "x".repeat(501) }
  });
  assert.equal(invalidReason.statusCode, 400);
  assert.equal(invalidReason.body.error.code, "AFRI_APPROVAL_REJECTION_REASON_INVALID");
  assert.equal(calls.reject, undefined);
});
