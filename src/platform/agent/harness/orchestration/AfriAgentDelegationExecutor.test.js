import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createAfriAgentDelegationExecutor, SOURCE_AGENT_ID } from "./AfriAgentDelegationExecutor.js";
import { AfriAgentApprovalAuthority } from "../approval/AfriAgentApprovalAuthority.js";
import { AfriAgentApprovalMemoryRepository } from "../approval/testing/AfriAgentApprovalMemoryRepository.js";

const plan = () => ({
  status: "PREVIEW",
  planningMode: "AI_STRUCTURED",
  requiresApprovalBeforeDelegation: true,
  executionStarted: false,
  executionChannel: "INTERNAL_ADMIN",
  paymentPolicy: "NO_AUTOMATIC_PAYMENT",
  objective: "Research a public website",
  summary: "Inspect the supplied public website",
  steps: [{
    step: 1,
    agentId: "AGENT-AFRIREA-001",
    capability: "research.analyze",
    task: "Analyze https://example.com",
    dependsOn: []
  }]
});

function setup({
  authorized = true,
  sourceAgentId = SOURCE_AGENT_ID,
  sourceCapabilityId = "afriaicommand.execute",
  serviceName = "AfriAICommand",
  errorPrefix = "AFRIAICOMMAND",
  failOnCall = null,
  failOnAgentId = null,
  delayMs = 0,
  maxConcurrency = 2,
  executionResult = { accepted: true },
  throwOnExecutionLookup = false
} = {}) {
  const repository = new AfriAgentApprovalMemoryRepository();
  const authority = new AfriAgentApprovalAuthority({
    repository,
    auditRepository: { async appendAuditEvent() {} },
    authorizeApprover: async () => true,
    clock: () => 10000,
    ttlMs: 5000
  });

  const agents = [
    {
      id: sourceAgentId,
      status: "ACTIVE",
      trustDomain: "INTERNAL",
      capabilities: [sourceCapabilityId]
    },
    {
      id: "AGENT-AFRIREA-001",
      name: "AfriREA Agent",
      status: "ACTIVE",
      trustDomain: "INTERNAL",
      organizationId: "afridigital",
      capabilities: ["research.analyze"]
    },
    {
      id: "AGENT-AFRIDEBUG-001",
      name: "AfriDebug Agent",
      status: "ACTIVE",
      trustDomain: "INTERNAL",
      organizationId: "afridigital",
      capabilities: ["debug.analyze"]
    }
  ];

  const capabilities = [
    { id: sourceCapabilityId, enabled: true, adminOnly: false },
    { id: "research.analyze", enabled: true, adminOnly: false },
    { id: "debug.analyze", enabled: true, adminOnly: false }
  ];

  let calls = 0;
  let activeCalls = 0;
  let maxActiveCalls = 0;
  const executionSourceIds = [];
  const executionPayloads = [];
  const executionContexts = [];
  let targetLookupCount = 0;
  const executor = createAfriAgentDelegationExecutor({
    approvalAuthority: authority,
    sourceAgentId,
    sourceCapabilityId,
    serviceName,
    errorPrefix,
    maxConcurrency,
    identityRegistry: {
      get: id => {
        if (throwOnExecutionLookup && id === "AGENT-AFRIREA-001" && ++targetLookupCount === 2) {
          throw new Error("TEST_REGISTRY_LOOKUP_FAILURE");
        }
        return agents.find(agent => agent.id === id) || null;
      },
      list: () => agents.map(agent => ({ ...agent }))
    },
    capabilityRegistry: {
      get: id => capabilities.find(capability => capability.id === id) || null,
      list: () => capabilities.map(capability => ({ ...capability }))
    },
    internalTaskClient: {
      async execute({ agentId, task, context }) {
        calls += 1;
        activeCalls += 1;
        maxActiveCalls = Math.max(maxActiveCalls, activeCalls);
        try {
          assert.ok(agentId);
          executionSourceIds.push(sourceAgentId);
          executionPayloads.push(task?.payload ?? null);
          executionContexts.push(structuredClone(context));
          assert.equal(context.executionChannel, "INTERNAL_ADMIN");
          assert.equal(context.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
          if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
          if (failOnCall === calls || failOnAgentId === agentId) {
            throw new Error("TEST_SPECIALIST_FAILURE");
          }
          return executionResult;
        } finally {
          activeCalls -= 1;
        }
      }
    }
  });

  return {
    executor,
    authority,
    getCalls: () => calls,
    getMaxActiveCalls: () => maxActiveCalls,
    getExecutionSourceIds: () => [...executionSourceIds],
    getExecutionPayloads: () => [...executionPayloads],
    getExecutionContexts: () => structuredClone(executionContexts),
    repository,
    agents,
    capabilities,
    authorized
  };
}

async function createApprovedPlan(authority, proposedPlan = plan(), sourceAgentId = SOURCE_AGENT_ID) {
  const record = await authority.request({
    sourceAgentId,
    requestedBy: "USER-1",
    plan: proposedPlan
  });
  await authority.approve({
    approvalId: record.approvalId,
    approverId: "ADMIN-1",
    principal: Object.freeze({ userId: "ADMIN-1", roles: ["AGENT_APPROVER"] })
  });
  return record.approvalId;
}

test("rejects execution when no production approval authority is injected", async () => {
  const executor = createAfriAgentDelegationExecutor({
    identityRegistry: { get: () => null, list: () => [] },
    capabilityRegistry: { get: () => null, list: () => [] },
    internalTaskClient: { execute: async () => assert.fail("must not execute") }
  });

  await assert.rejects(
    executor.execute({ requesterId: "USER-1", approvalId: "approval-1", plan: plan() }),
    { message: "AFRIAICOMMAND_APPROVAL_AUTHORITY_UNAVAILABLE" }
  );
});

test("rejects missing approval before invoking any specialist", async () => {
  const { executor, getCalls } = setup();

  await assert.rejects(
    executor.execute({ plan: plan() }),
    { message: "AFRIAICOMMAND_APPROVAL_REQUIRED" }
  );
  assert.equal(getCalls(), 0);
});

test("consumes an exact approval before invoking the specialist", async () => {
  const { executor, authority, getCalls } = setup();
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan);

  const result = await executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan });

  assert.equal(result.status, "COMPLETED");
  assert.equal(result.executionStarted, true);
  assert.equal(result.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
  assert.equal(getCalls(), 1);
});

test("rejects a different requester before invoking any specialist", async () => {
  const { executor, authority, getCalls } = setup();
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  await assert.rejects(
    executor.execute({ approvalId, requesterId: "USER-2", plan: approvedPlan }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
  assert.equal(getCalls(), 0);
});

test("modified plan is rejected before any specialist invocation", async () => {
  const { executor, authority, getCalls } = setup();
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  const changedPlan = plan();
  changedPlan.steps[0].task = "Changed after approval";

  await assert.rejects(
    executor.execute({ requesterId: "USER-1", approvalId, plan: changedPlan }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
  assert.equal(getCalls(), 0);
});

test("approval replay is rejected before a second specialist invocation", async () => {
  const { executor, authority, getCalls } = setup();
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan);

  await executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan });
  await assert.rejects(
    executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
  assert.equal(getCalls(), 1);
});

test("heuristic previews cannot be delegated", async () => {
  const { executor, authority, getCalls } = setup();
  const approvalId = await createApprovedPlan(authority, plan());
  const heuristic = {
    ...plan(),
    planningMode: "HEURISTIC_FALLBACK"
  };

  await assert.rejects(
    executor.execute({ requesterId: "USER-1", approvalId, plan: heuristic }),
    { message: "AFRIAICOMMAND_PLAN_NOT_EXECUTABLE" }
  );
  assert.equal(getCalls(), 0);
});

test("live authorization is revalidated before approval consumption", async () => {
  const { executor, authority, getCalls, capabilities } = setup();
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  capabilities.find(capability => capability.id === "research.analyze").enabled = false;

  await assert.rejects(
    executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan }),
    { message: "AFRI_AGENT_EXECUTION_PLAN_CAPABILITY_NOT_ELIGIBLE" }
  );
  assert.equal(getCalls(), 0);
});

test("uses configured source identity and service metadata, ignoring caller-supplied identity", async () => {
  const sourceAgentId = "AGENT-AFRIAICODER-001";
  const { executor, authority, getCalls, getExecutionSourceIds } = setup({
    sourceAgentId,
    sourceCapabilityId: "afriaicoder.execute",
    serviceName: "AfriAICoder",
    errorPrefix: "AFRIAICODER"
  });
  const approvedPlan = plan();
  const approvalId = await createApprovedPlan(authority, approvedPlan, sourceAgentId);

  const result = await executor.execute({ requesterId: "USER-1",
    approvalId,
    plan: approvedPlan,
    sourceAgentId: SOURCE_AGENT_ID
  });

  assert.equal(result.service, "AfriAICoder");
  assert.equal(result.status, "COMPLETED");
  assert.equal(getCalls(), 1);
  assert.deepEqual(getExecutionSourceIds(), [sourceAgentId]);
});


test("passes completed dependency results to the next specialist", async () => {
  const { executor, authority, getCalls, getExecutionPayloads } = setup();
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIREA-001",
        capability: "research.analyze",
        task: "Continue using the first research result",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  const result = await executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan });
  assert.equal(result.status, "COMPLETED");
  assert.equal(getCalls(), 2);
  assert.deepEqual(getExecutionPayloads()[1].dependencyResults, [{
    step: 1,
    agentId: "AGENT-AFRIREA-001",
    capability: "research.analyze",
    result: { accepted: true }
  }]);
});


test("runs independent specialists concurrently and preserves plan order", async () => {
  const { executor, authority, getMaxActiveCalls } = setup({ delayMs: 20 });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIDEBUG-001",
        capability: "debug.analyze",
        task: "Independently inspect the research findings",
        dependsOn: []
      },
      {
        step: 3,
        agentId: "AGENT-AFRIREA-001",
        capability: "research.analyze",
        task: "Continue after the first research result",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  const result = await executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: approvedPlan
  });

  assert.equal(result.status, "COMPLETED");
  assert.deepEqual(result.steps.map(step => step.step), [1, 2, 3]);
  assert.ok(getMaxActiveCalls() >= 2);
  assert.equal(result.totals.completed, 3);
});

test("an independent specialist continues when another specialist fails", async () => {
  const { executor, authority } = setup({
    delayMs: 20,
    failOnAgentId: "AGENT-AFRIREA-001"
  });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIDEBUG-001",
        capability: "debug.analyze",
        task: "Independently inspect the research findings",
        dependsOn: []
      },
      {
        step: 3,
        agentId: "AGENT-AFRIREA-001",
        capability: "research.analyze",
        task: "Continue using the first research result",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  const result = await executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: approvedPlan
  });

  assert.equal(result.status, "PARTIAL");
  assert.equal(result.totals.failed, 1);
  assert.equal(result.totals.completed, 1);
  assert.equal(result.totals.skipped, 1);
  assert.equal(result.steps[1].status, "COMPLETED");
  assert.equal(result.steps[2].status, "SKIPPED");
});

test("skips dependent specialists when a prerequisite fails", async () => {
  const { executor, authority, getCalls } = setup({ failOnCall: 1 });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIREA-001",
        capability: "research.analyze",
        task: "Continue using the first research result",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(authority, approvedPlan);
  const result = await executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan });
  assert.equal(result.status, "FAILED");
  assert.equal(result.totals.failed, 1);
  assert.equal(result.totals.skipped, 1);
  assert.equal(result.steps[1].status, "SKIPPED");
  assert.equal(result.steps[1].errorCode, "AFRIAICOMMAND_DEPENDENCY_NOT_COMPLETED");
  assert.equal(getCalls(), 1);
});


test("rejects delegation when the source capability is disabled", async () => {
  const state = setup();
  state.capabilities.find(item => item.id === "afriaicommand.execute").enabled = false;
  const approvalId = await createApprovedPlan(state.authority);

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: plan() }),
    { message: "AFRIAICOMMAND_SOURCE_CAPABILITY_NOT_AUTHORIZED" }
  );
  assert.equal(state.getCalls(), 0);
});

test("rejects delegation when the source identity does not own its capability", async () => {
  const state = setup();
  state.agents.find(item => item.id === SOURCE_AGENT_ID).capabilities = [];
  const approvalId = await createApprovedPlan(state.authority);

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: plan() }),
    { message: "AFRIAICOMMAND_SOURCE_CAPABILITY_NOT_AUTHORIZED" }
  );
  assert.equal(state.getCalls(), 0);
});

test("contains non-serializable specialist results as a controlled failed step", async () => {
  const state = setup({ executionResult: () => "not JSON serializable" });
  const approvalId = await createApprovedPlan(state.authority);
  const result = await state.executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: plan()
  });

  assert.equal(result.status, "FAILED");
  assert.equal(result.steps[0].status, "FAILED");
  assert.equal(result.steps[0].errorCode, "AFRIAICOMMAND_RESULT_NOT_SERIALIZABLE");
});

test("contains registry lookup failures and continues independent specialists", async () => {
  const state = setup({ throwOnExecutionLookup: true });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIDEBUG-001",
        capability: "debug.analyze",
        task: "Independently inspect the research findings",
        dependsOn: []
      }
    ]
  };
  const approvalId = await createApprovedPlan(state.authority, approvedPlan);
  const result = await state.executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: approvedPlan
  });

  assert.equal(result.status, "PARTIAL");
  assert.equal(result.totals.failed, 1);
  assert.equal(result.totals.completed, 1);
  assert.equal(result.steps[0].errorCode, "TEST_REGISTRY_LOOKUP_FAILURE");
  assert.equal(result.steps[1].status, "COMPLETED");
  assert.equal(state.getCalls(), 1);
});


test("persists completed grant lifecycle, specialist context, and bounded result hash", async () => {
  const state = setup({ executionResult: { accepted: true, value: 42 } });
  const approvalId = await createApprovedPlan(state.authority);
  const result = await state.executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: plan()
  });

  const grant = state.repository.grants.get(result.grantId);
  const steps = state.repository.grantSteps.get(result.grantId);
  const serialized = JSON.stringify({ accepted: true, value: 42 });
  const expectedHash = createHash("sha256").update(serialized, "utf8").digest("hex");

  assert.equal(grant.status, "COMPLETED");
  assert.equal(steps[0].status, "COMPLETED");
  assert.equal(steps[0].resultHash, expectedHash);
  assert.equal(steps[0].resultHash.length, 64);
  assert.equal(steps[0].result, undefined);
  assert.deepEqual(state.getExecutionContexts().map(item => ({
    grantId: item.grantId,
    stepNumber: item.stepNumber
  })), [{ grantId: result.grantId, stepNumber: 1 }]);
});

test("persists failed and skipped steps and fails the grant", async () => {
  const state = setup({ failOnCall: 1 });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIREA-001",
        capability: "research.analyze",
        task: "Continue after prerequisite",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(state.authority, approvedPlan);
  const result = await state.executor.execute({
    requesterId: "USER-1",
    approvalId,
    plan: approvedPlan
  });

  const grant = state.repository.grants.get(result.grantId);
  const steps = state.repository.grantSteps.get(result.grantId);
  assert.equal(grant.status, "FAILED");
  assert.deepEqual(steps.map(item => item.status), ["FAILED", "SKIPPED"]);
  assert.equal(steps[0].resultHash, null);
});

test("aborts before dispatch when grant claim persistence fails", async () => {
  const state = setup();
  const approvalId = await createApprovedPlan(state.authority);
  state.authority.claimGrantStep = async () => {
    throw new Error("TEST_CLAIM_STORE_FAILURE");
  };

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: plan() }),
    { message: "TEST_CLAIM_STORE_FAILURE" }
  );
  assert.equal(state.getCalls(), 0);
  const grantId = [...state.repository.grants.keys()][0];
  assert.equal(state.repository.grants.get(grantId).status, "ACTIVE");
  assert.equal(state.repository.grantSteps.get(grantId)[0].status, "PENDING");
});

test("does not convert grant completion persistence failure into specialist failure", async () => {
  const state = setup();
  const approvalId = await createApprovedPlan(state.authority);
  state.authority.completeGrantStep = async () => {
    throw new Error("TEST_COMPLETION_STORE_FAILURE");
  };

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: plan() }),
    { message: "TEST_COMPLETION_STORE_FAILURE" }
  );
  assert.equal(state.getCalls(), 1);
  const grantId = [...state.repository.grants.keys()][0];
  assert.equal(state.repository.grants.get(grantId).status, "ACTIVE");
  assert.equal(state.repository.grantSteps.get(grantId)[0].status, "RUNNING");
});

test("propagates grant failure persistence errors", async () => {
  const state = setup({ failOnCall: 1 });
  const approvalId = await createApprovedPlan(state.authority);
  state.authority.failGrantStep = async () => {
    throw new Error("TEST_FAILURE_STORE_FAILURE");
  };

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: plan() }),
    { message: "TEST_FAILURE_STORE_FAILURE" }
  );
  const grantId = [...state.repository.grants.keys()][0];
  assert.equal(state.repository.grantSteps.get(grantId)[0].status, "RUNNING");
  assert.equal(state.repository.grants.get(grantId).status, "ACTIVE");
});

test("propagates dependent-step skip persistence errors", async () => {
  const state = setup({ failOnCall: 1 });
  const approvedPlan = {
    ...plan(),
    steps: [
      ...plan().steps,
      {
        step: 2,
        agentId: "AGENT-AFRIDEBUG-001",
        capability: "debug.analyze",
        task: "Dependent follow-up",
        dependsOn: [1]
      }
    ]
  };
  const approvalId = await createApprovedPlan(state.authority, approvedPlan);
  state.authority.skipGrantStep = async () => {
    throw new Error("TEST_SKIP_STORE_FAILURE");
  };

  await assert.rejects(
    state.executor.execute({ requesterId: "USER-1", approvalId, plan: approvedPlan }),
    { message: "TEST_SKIP_STORE_FAILURE" }
  );
  const grantId = [...state.repository.grants.keys()][0];
  assert.deepEqual(
    state.repository.grantSteps.get(grantId).map(item => item.status),
    ["FAILED", "PENDING"]
  );
  assert.equal(state.repository.grants.get(grantId).status, "ACTIVE");
});
