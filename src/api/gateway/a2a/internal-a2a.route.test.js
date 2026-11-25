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

async function prepareRealHarnessIntegration() {
  const [{ default: Identity }, { default: Capabilities }, { default: ServiceRegistry }, { default: Harness }, { default: Provider }, { default: Coder }] = await Promise.all([
    import("../../../platform/agent/identity/AfriAgentIdentityRegistry.js"),
    import("../../../platform/agent/registry/AfriAgentCapabilityRegistry.js"),
    import("../../../platform/agent/services/AfriA2AServiceRegistry.js"),
    import("../../../platform/agent/harness/runtime/AfriAgentHarnessRuntime.js"),
    import("../../../platform/agent/harness/providers/AfriAgentCapabilityHandlerProvider.js"),
    import("../../../platform/agent/services/AfriAICoderA2AService.js")
  ]);

  Identity.initializeFromEnv();
  ServiceRegistry.initialize();

  Capabilities.upsert({
    id: "afriaicommand.execute",
    service: "AfriAICommand",
    enabled: true,
    adminOnly: false,
    internalOnly: true,
    handler: async () => ({ status: "TEST_SOURCE" })
  });

  if (!Harness.getProvider("afri-agent-capability-handler-provider")) {
    Harness.registerProvider("afri-agent-capability-handler-provider", Provider);
  }

  const coder = Identity.get(targetId);
  assert.ok(coder, "AfriAICoder identity must exist");
  if (!coder.provider) {
    Identity.bindProvider(targetId, "afri-agent-capability-handler-provider");
  } else {
    assert.equal(coder.provider, "afri-agent-capability-handler-provider");
  }

  assert.equal(Identity.get(sourceId).status, "ACTIVE");
  assert.equal(Identity.get(targetId).status, "ACTIVE");
  assert.equal(Capabilities.get("afriaicommand.execute").enabled, true);
  assert.equal(Capabilities.get("engineering.backend").enabled, true);

  return { Harness, Coder };
}

function integrationBody() {
  return Buffer.from(JSON.stringify({
    agentId: targetId,
    task: {
      capability: "engineering.backend",
      payload: {
        objective: "Prepare a bounded backend implementation proposal",
        dependencyResults: []
      }
    },
    context: {
      taskId: "integration-task-001",
      planObjective: "Verify AfriAICoder backend execution",
      planSummary: "Exercise the real internal Harness dispatch path",
      step: 1,
      stepNumber: 1,
      grantId: "integration-grant-001",
      dependsOn: [],
      executionReceipt: "integration-test-receipt"
    }
  }));
}

async function invokeIntegration(handler) {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; finish(); return this; }
  };

  await handler({
    body: integrationBody(),
    get(name) {
      return ({
        "x-afri-agent-id": sourceId,
        "x-afri-timestamp": "1794860000000",
        "x-afri-nonce": "integrationnonce",
        "x-afri-signature": "integrationsignature"
      })[name];
    }
  }, res);

  await done;
  return res;
}

function setupRealIntegration(Harness, approvalRuntimeProvider) {
  let handler;
  internalA2ARoute(
    { post(_path, ...stack) { handler = stack.at(-1); } },
    {
      requestAuth: {
        async isReady() { return true; },
        async verify() {
          return { verified: true, agent: { id: sourceId } };
        }
      },
      harnessRuntime: Harness,
      approvalRuntimeProvider
    }
  );
  return handler;
}

test("real internal route executes AfriAICoder through Harness only after receipt verification", async () => {
  const { Harness, Coder } = await prepareRealHarnessIntegration();
  const calls = [];
  Coder.configureExecutionAdapter({
    async execute(input) {
      calls.push(input);
      return { status: "PATCH_PROPOSAL_READY", capability: input.capability };
    }
  });

  try {
    const handler = setupRealIntegration(Harness, () => ({
      authority: {
        async consumeExecutionReceipt({ token, envelope }) {
          assert.equal(token, "integration-test-receipt");
          assert.deepEqual(envelope, {
            sourceAgentId: sourceId,
            targetAgentId: targetId,
            capabilityId: "engineering.backend",
            grantId: "integration-grant-001",
            stepNumber: 1,
            taskId: "integration-task-001",
            planObjective: "Verify AfriAICoder backend execution",
            planSummary: "Exercise the real internal Harness dispatch path",
            step: 1,
            objective: "Prepare a bounded backend implementation proposal",
            dependsOn: [],
            dependencyResults: [],
            executionChannel: "INTERNAL_ADMIN",
            paymentPolicy: "NO_AUTOMATIC_PAYMENT"
          });
          return { verified: true };
        }
      }
    }));

    const res = await invokeIntegration(handler);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.result.status, "PATCH_PROPOSAL_READY");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].agentId, targetId);
    assert.equal(calls[0].capability, "engineering.backend");
    assert.equal(calls[0].context.sourceAgentId, sourceId);
    assert.equal(calls[0].context.executionChannel, "INTERNAL_ADMIN");
    assert.equal(calls[0].context.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
  } finally {
    Coder.clearExecutionAdapter();
  }
});

test("invalid receipt is rejected before the real AfriAICoder adapter executes", async () => {
  const { Harness, Coder } = await prepareRealHarnessIntegration();
  let adapterCalls = 0;

  Coder.configureExecutionAdapter({
    async execute() {
      adapterCalls += 1;
      return { status: "SHOULD_NOT_EXECUTE" };
    }
  });

  try {
    const handler = setupRealIntegration(Harness, () => ({
      authority: {
        async consumeExecutionReceipt() {
          throw new Error("AFRI_AGENT_EXECUTION_RECEIPT_INVALID");
        }
      }
    }));

    const res = await invokeIntegration(handler);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.ok, false);
    assert.equal(res.body.error.code, "AFRI_AGENT_EXECUTION_RECEIPT_INVALID");
    assert.equal(adapterCalls, 0);
  } finally {
    Coder.clearExecutionAdapter();
  }
});

async function invokeIntegrationBody(handler, body) {
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; finish(); return this; }
  };
  await handler({
    body: Buffer.from(JSON.stringify(body)),
    get(name) {
      return ({
        "x-afri-agent-id": sourceId,
        "x-afri-timestamp": "1794860000000",
        "x-afri-nonce": "integrationnonce-real-grant",
        "x-afri-signature": "integrationsignature"
      })[name];
    }
  }, res);
  await done;
  return res;
}

test("approved grant issues and consumes a real receipt before AfriAICoder execution", async () => {
  const [{ AfriAgentApprovalAuthority }, { AfriAgentApprovalMemoryRepository }, { createHash }] = await Promise.all([
    import("../../../platform/agent/harness/approval/AfriAgentApprovalAuthority.js"),
    import("../../../platform/agent/harness/approval/testing/AfriAgentApprovalMemoryRepository.js"),
    import("node:crypto")
  ]);
  const { Harness, Coder } = await prepareRealHarnessIntegration();
  const repository = new AfriAgentApprovalMemoryRepository();
  const authority = new AfriAgentApprovalAuthority({
    repository,
    auditRepository: { async appendAuditEvent() {} },
    authorizeApprover: async ({ approverId }) => approverId === "ADMIN-1",
    clock: () => 10000,
    ttlMs: 5000,
    grantTtlMs: 5000
  });
  const plan = {
    status: "PREVIEW",
    planningMode: "AI_STRUCTURED",
    requiresApprovalBeforeDelegation: true,
    executionStarted: false,
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    objective: "Verify AfriAICoder backend execution",
    summary: "Exercise the approved grant and trusted receipt lifecycle",
    steps: [{
      step: 1,
      agentId: targetId,
      capability: "engineering.backend",
      task: "Prepare a bounded backend implementation proposal",
      dependsOn: []
    }]
  };

  const approval = await authority.request({
    sourceAgentId: sourceId,
    requestedBy: "USER-1",
    plan
  });
  await authority.approve({
    approvalId: approval.approvalId,
    approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" }
  });
  const { grant } = await authority.consumeAndCreateGrant({
    approvalId: approval.approvalId,
    sourceAgentId: sourceId,
    requesterId: "USER-1",
    plan
  });
  assert.equal(grant.status, "ACTIVE");

  const claimed = await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: targetId,
    capabilityId: "engineering.backend"
  });
  assert.equal(claimed.status, "RUNNING");

  const envelope = {
    sourceAgentId: sourceId,
    targetAgentId: targetId,
    capabilityId: "engineering.backend",
    grantId: grant.grantId,
    stepNumber: 1,
    taskId: "integration-real-grant-task-001",
    planObjective: plan.objective,
    planSummary: plan.summary,
    step: 1,
    objective: plan.steps[0].task,
    dependsOn: [],
    dependencyResults: [],
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT"
  };
  const receipt = await authority.issueExecutionReceipt({ envelope });
  const adapterCalls = [];
  Coder.configureExecutionAdapter({
    async execute(input) {
      adapterCalls.push(input);
      return { status: "PATCH_PROPOSAL_READY", capability: input.capability };
    }
  });

  try {
    const handler = setupRealIntegration(Harness, () => ({ authority }));
    const res = await invokeIntegrationBody(handler, {
      agentId: targetId,
      task: {
        capability: "engineering.backend",
        payload: { objective: plan.steps[0].task, dependencyResults: [] }
      },
      context: {
        taskId: envelope.taskId,
        planObjective: plan.objective,
        planSummary: plan.summary,
        step: 1,
        stepNumber: 1,
        grantId: grant.grantId,
        dependsOn: [],
        executionReceipt: receipt.token
      }
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.result.status, "PATCH_PROPOSAL_READY");
    assert.equal(adapterCalls.length, 1);
    assert.equal(adapterCalls[0].agentId, targetId);

    const resultHash = createHash("sha256")
      .update(JSON.stringify(res.body.result), "utf8")
      .digest("hex");
    const completed = await authority.completeGrantStep({
      grantId: grant.grantId,
      stepNumber: 1,
      resultHash
    });
    assert.equal(completed.status, "COMPLETED");

    await assert.rejects(
      authority.consumeExecutionReceipt({ token: receipt.token, envelope }),
      error => /RECEIPT|GRANT_STEP|GRANT/.test(error.message)
    );
  } finally {
    Coder.clearExecutionAdapter();
  }
});
