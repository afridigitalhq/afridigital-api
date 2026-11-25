import test from "node:test";
import assert from "node:assert/strict";
import {
  AfriAgentApprovalAuthority,
  fingerprintAfriAgentExecutionPlan,
  createAfriAgentApprovalAuthorizer
} from "./AfriAgentApprovalAuthority.js";
import { AfriAgentApprovalMemoryRepository } from "./testing/AfriAgentApprovalMemoryRepository.js";

const makePlan = () => ({
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

function setup(options = {}) {
  const repository = new AfriAgentApprovalMemoryRepository();
  let now = 10000;

  const authority = new AfriAgentApprovalAuthority({
    repository,
    auditRepository: options.auditRepository || { async appendAuditEvent() {} },
    authorizeApprover: options.authorizeApprover || (async ({ approverId }) => approverId === "ADMIN-1"),
    clock: () => now,
    ttlMs: options.ttlMs || 5000,
    grantTtlMs: options.grantTtlMs || 5000,
    executionLeaseMs: options.executionLeaseMs ?? 30 * 60 * 1000
  });

  return { authority, advance: ms => { now += ms; } };
}

async function request(authority, plan = makePlan()) {
  return authority.request({
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requestedBy: "USER-1",
    plan
  });
}

test("rejects approval actions without an authenticated principal", async () => {
  const { authority } = setup();
  const record = await request(authority);
  await assert.rejects(authority.approve({ approvalId: record.approvalId, approverId: "ADMIN-1" }), { message: "AFRI_APPROVAL_PRINCIPAL_REQUIRED" });
  await assert.rejects(authority.reject({ approvalId: record.approvalId, approverId: "ADMIN-1" }), { message: "AFRI_APPROVAL_PRINCIPAL_REQUIRED" });
});

test("production authorizer revalidates session identity and current approver role", async () => {
  let calls = 0;
  const authorizer = createAfriAgentApprovalAuthorizer({
    sessionService: {
      async verifyPrincipal(principal) {
        calls++;
        if (principal.invalid) return null;
        return { userId: principal.userId, roles: principal.roles };
      }
    }
  });
  assert.equal(await authorizer({ approverId: "ADMIN-1", principal: { userId: "ADMIN-1", roles: ["AGENT_APPROVER"] } }), true);
  assert.equal(await authorizer({ approverId: "ADMIN-1", principal: { userId: "ADMIN-1", roles: ["USER"] } }), false);
  assert.equal(await authorizer({ approverId: "ADMIN-2", principal: { userId: "ADMIN-1", roles: ["AGENT_APPROVER"] } }), false);
  assert.equal(await authorizer({ approverId: "ADMIN-1", principal: { userId: "ADMIN-1", invalid: true } }), false);
  assert.equal(calls, 4);
});

test("production authorizer requires a principal-verification service", () => {
  assert.throws(() => createAfriAgentApprovalAuthorizer(), { message: "AFRI_APPROVAL_IDENTITY_SERVICE_REQUIRED" });
  assert.throws(() => createAfriAgentApprovalAuthorizer({ sessionService: {} }), { message: "AFRI_APPROVAL_IDENTITY_SERVICE_REQUIRED" });
});

test("requires an injected atomic repository and approver authorizer", () => {
  assert.throws(
    () => new AfriAgentApprovalAuthority({ repository: {} }),
    { message: "AFRI_APPROVAL_ATOMIC_REPOSITORY_REQUIRED" }
  );
  assert.throws(
    () => new AfriAgentApprovalAuthority({ repository: new AfriAgentApprovalMemoryRepository() }),
    { message: "AFRI_APPROVAL_AUTHORIZER_REQUIRED" }
  );
});

test("fingerprint binds target, capability, task and dependencies", () => {
  const original = makePlan();
  const changed = makePlan();
  changed.steps[0].task = "Analyze a different website";
  assert.notEqual(fingerprintAfriAgentExecutionPlan(original), fingerprintAfriAgentExecutionPlan(changed));
});

test("creates pending approval and permits an authorized independent approver", async () => {
  const { authority } = setup();
  const record = await request(authority);
  assert.equal(record.status, "PENDING");

  const approved = await authority.approve({
    approvalId: record.approvalId,
    approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" }
  });
  assert.equal(approved.status, "APPROVED");
  assert.equal(approved.approvedBy, "ADMIN-1");
});

test("rejects requester self-approval and unauthorized approvers", async () => {
  const { authority } = setup();
  const record = await request(authority);

  await assert.rejects(
    authority.approve({ approvalId: record.approvalId, approverId: "USER-1",
    principal: { userId: "USER-1" } }),
    { message: "AFRI_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED" }
  );
  await assert.rejects(
    authority.approve({ approvalId: record.approvalId, approverId: "INTRUDER",
    principal: { userId: "INTRUDER" } }),
    { message: "AFRI_APPROVAL_APPROVER_FORBIDDEN" }
  );
});

test("rejects expired approvals", async () => {
  const { authority, advance } = setup();
  const record = await request(authority);
  advance(5001);

  await assert.rejects(
    authority.approve({ approvalId: record.approvalId, approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" } }),
    { message: "AFRI_APPROVAL_EXPIRED" }
  );
});

test("consumes an exact approval once and rejects modified plans and replay", async () => {
  const { authority } = setup();
  const record = await request(authority);
  await authority.approve({ approvalId: record.approvalId, approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" } });

  const changed = makePlan();
  changed.steps[0].task = "Modified after approval";

  await assert.rejects(
    authority.consume({
      requesterId: "USER-1",
      approvalId: record.approvalId,
      sourceAgentId: "AGENT-AFRIAICOMMAND-001",
      plan: changed
    }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );

  const consumed = await authority.consume({
      requesterId: "USER-1",
    approvalId: record.approvalId,
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    plan: makePlan()
  });
  assert.equal(consumed.status, "CONSUMED");

  await assert.rejects(
    authority.consume({
      requesterId: "USER-1",
      approvalId: record.approvalId,
      sourceAgentId: "AGENT-AFRIAICOMMAND-001",
      plan: makePlan()
    }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
});

test("rejects wrong source identity and rejected approvals", async () => {
  const { authority } = setup();
  const record = await request(authority);
  await authority.approve({ approvalId: record.approvalId, approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" } });

  await assert.rejects(
    authority.consume({
      requesterId: "USER-1",
      approvalId: record.approvalId,
      sourceAgentId: "AGENT-OTHER-001",
      plan: makePlan()
    }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );

  const second = await request(authority);
  await authority.reject({
    approvalId: second.approvalId,
    approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" },
    reason: "Not approved"
  });

  await assert.rejects(
    authority.consume({
      requesterId: "USER-1",
      approvalId: second.approvalId,
      sourceAgentId: "AGENT-AFRIAICOMMAND-001",
      plan: makePlan()
    }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
});

test("rejects plans that are not explicitly approval-gated structured previews", () => {
  const invalid = makePlan();
  invalid.requiresApprovalBeforeDelegation = false;

  assert.throws(
    () => fingerprintAfriAgentExecutionPlan(invalid),
    { message: "AFRI_APPROVAL_PLAN_NOT_APPROVABLE" }
  );
});


test("rejects excessively complex approval plans",()=>{
  const cyclic=makePlan();
  cyclic.steps[0].dependsOn.push(cyclic.steps[0].dependsOn);
  assert.throws(()=>fingerprintAfriAgentExecutionPlan(cyclic),{message:"AFRI_APPROVAL_PLAN_VALUE_INVALID"});
  const deeplyNested=makePlan();
  let nested=[];
  const root=nested;
  for(let i=0;i<20;i++){const next=[];nested.push(next);nested=next;}
  deeplyNested.steps[0].dependsOn=root;
  assert.throws(()=>fingerprintAfriAgentExecutionPlan(deeplyNested),{message:"AFRI_APPROVAL_PLAN_VALUE_INVALID"});
  const oversized=makePlan();
  oversized.steps[0].dependsOn=["x".repeat(16385)];
  assert.throws(()=>fingerprintAfriAgentExecutionPlan(oversized),{message:"AFRI_APPROVAL_PLAN_VALUE_INVALID"});
});


async function createApprovedGrant(authority, plan = makePlan()) {
  const approval = await request(authority, plan);
  await authority.approve({
    approvalId: approval.approvalId,
    approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" }
  });
  return authority.consumeAndCreateGrant({
    approvalId: approval.approvalId,
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requesterId: "USER-1",
    plan
  });
}

test("authority recovers expired execution leases and forwards audit events", async () => {
  const events = [];
  const { authority, advance } = setup({
    executionLeaseMs: 1000,
    auditRepository: {
      async appendAuditEvent(event) {
        events.push(event);
      }
    }
  });
  const plan = makePlan();
  plan.steps.push({
    step: 2,
    agentId: "AGENT-AFRIDEBUG-001",
    capability: "debug.analyze",
    task: "Analyze the research output",
    dependsOn: [1]
  });
  const { grant } = await createApprovedGrant(authority, plan);

  await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });

  const recoveryEventStart = events.length;
  advance(1001);
  const result = await authority.recoverExpiredGrantSteps();
  const recoveryEvents = events.slice(recoveryEventStart);

  assert.deepEqual(result, { recovered: 1, skipped: 1, grantsFinalized: 1 });
  assert.equal(recoveryEvents.length, 3);
  assert.equal(recoveryEvents[0].eventType, "AGENT_EXECUTION_STEP_FAILED");
  assert.equal(recoveryEvents[0].details.errorCode, "EXECUTION_LEASE_EXPIRED");
  assert.equal(recoveryEvents[1].eventType, "AGENT_EXECUTION_STEP_SKIPPED");
  assert.equal(recoveryEvents[1].details.errorCode, "DEPENDENCY_FAILED");
  assert.equal(recoveryEvents[2].eventType, "AGENT_EXECUTION_GRANT_FAILED");
  assert.equal(recoveryEvents[2].outcome, "FAILURE");
  assert.ok(recoveryEvents.every(event => event.eventId && event.createdAt === 11001));
  assert.equal((await authority.repository.grants.get(grant.grantId)).status, "FAILED");
});

test("memory recovery fails closed for missing and invalid execution lease timestamps", async () => {
  const repository = new AfriAgentApprovalMemoryRepository();
  repository.grants = new Map();
  repository.grantSteps = new Map();
  const invalidLeases = [null, undefined, "invalid"];
  for (let index = 0; index < invalidLeases.length; index++) {
    const grantId = `legacy-grant-${index + 1}`;
    repository.grants.set(grantId, {
      grantId,
      status: "ACTIVE",
      expiresAt: 50000
    });
    const step = {
      grantId,
      stepNumber: 1,
      status: "RUNNING",
      dependsOn: [],
      resultHash: null
    };
    if (invalidLeases[index] !== undefined) {
      step.leaseExpiresAt = invalidLeases[index];
    }
    repository.grantSteps.set(grantId, [step]);
  }

  const events = [];
  const result = await repository.recoverExpiredExecutionGrantSteps({
    now: 11000,
    writeAuditEvent: async (_client, event) => { events.push(event); }
  });

  assert.deepEqual(result, { recovered: 3, skipped: 0, grantsFinalized: 3 });
  for (let index = 0; index < invalidLeases.length; index++) {
    const grantId = `legacy-grant-${index + 1}`;
    assert.equal(repository.grantSteps.get(grantId)[0].status, "FAILED");
    assert.equal(repository.grantSteps.get(grantId)[0].errorCode, "EXECUTION_LEASE_EXPIRED");
    assert.equal(repository.grants.get(grantId).status, "FAILED");
  }
  const failures = events.filter(event => event.eventType === "AGENT_EXECUTION_STEP_FAILED");
  assert.equal(failures.length, 3);
  assert.ok(failures.every(event => event.details.errorCode === "EXECUTION_LEASE_EXPIRED"));
});

test("authority rejects recovery when the repository lacks recovery support", async () => {
  const { authority } = setup();
  authority.repository.recoverExpiredExecutionGrantSteps = undefined;

  await assert.rejects(
    authority.recoverExpiredGrantSteps(),
    { message: "AFRI_EXECUTION_GRANT_RECOVERY_REPOSITORY_REQUIRED" }
  );
});

test("authority rejects recovery when the audit repository is unavailable", async () => {
  const { authority } = setup();
  authority.auditRepository = undefined;

  await assert.rejects(
    authority.recoverExpiredGrantSteps(),
    { message: "AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED" }
  );
});

test("claims and completes an execution grant step with a SHA-256 result hash", async () => {
  const { authority } = setup();
  const { grant, steps } = await createApprovedGrant(authority);
  assert.equal(grant.status, "ACTIVE");
  assert.equal(steps[0].status, "PENDING");

  const claimed = await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });
  assert.equal(claimed.status, "RUNNING");

  const hash = "a".repeat(64);
  const completed = await authority.completeGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    resultHash: hash
  });
  assert.equal(completed.status, "COMPLETED");
  assert.equal(completed.resultHash, hash);
  assert.equal((await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  })), null);
  assert.equal((await authority.repository.grants.get(grant.grantId)).status, "COMPLETED");
});

test("rejects incorrect target or capability and prevents duplicate step claims", async () => {
  const { authority } = setup();
  const { grant } = await createApprovedGrant(authority);

  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-OTHER-001",
    capabilityId: "research.analyze"
  }), null);

  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "other.capability"
  }), null);

  const claimed = await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });
  assert.equal(claimed.status, "RUNNING");

  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  }), null);
});

test("enforces dependencies and persists skipped dependent steps", async () => {
  const { authority } = setup();
  const plan = makePlan();
  plan.steps.push({
    step: 2,
    agentId: "AGENT-AFRIDEBUG-001",
    capability: "debug.analyze",
    task: "Analyze the research output",
    dependsOn: [1]
  });
  const { grant } = await createApprovedGrant(authority, plan);

  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 2,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze"
  }), null);

  const first = await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });
  assert.equal(first.status, "RUNNING");

  assert.equal((await authority.failGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    errorCode: "SPECIALIST_FAILED"
  })).status, "FAILED");

  const skipped = await authority.skipGrantStep({
    grantId: grant.grantId,
    stepNumber: 2,
    errorCode: "DEPENDENCY_FAILED"
  });
  assert.equal(skipped.status, "SKIPPED");
  assert.equal((await authority.repository.grants.get(grant.grantId)).status, "FAILED");
});

test("rolls back a claim when audit persistence fails and expires grants before claim", async () => {
  let failAudit = false;
  const { authority, advance } = setup({
    auditRepository: {
      async appendAuditEvent() {
        if (failAudit) throw new Error("AUDIT_WRITE_FAILED");
      }
    },
    grantTtlMs: 1000
  });
  const { grant } = await createApprovedGrant(authority);
  failAudit = true;

  await assert.rejects(authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  }), { message: "AUDIT_WRITE_FAILED" });

  assert.equal(authority.repository.grantSteps.get(grant.grantId)[0].status, "PENDING");

  failAudit = false;
  advance(1001);
  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  }), null);
  assert.equal(authority.repository.grants.get(grant.grantId).status, "EXPIRED");
});

test("keeps an expired grant active until every in-flight memory step settles", async () => {
  const { authority, advance } = setup({ grantTtlMs: 1000 });
  const plan = makePlan();
  plan.steps.push(
    { step: 2, agentId: "AGENT-AFRIDEBUG-001", capability: "debug.analyze", task: "Second running task", dependsOn: [] },
    { step: 3, agentId: "AGENT-AFRIDEBUG-001", capability: "debug.analyze", task: "Pending task", dependsOn: [] }
  );
  const { grant } = await createApprovedGrant(authority, plan);

  assert.equal((await authority.claimGrantStep({
    grantId: grant.grantId, stepNumber: 1, targetAgentId: "AGENT-AFRIREA-001", capabilityId: "research.analyze"
  })).status, "RUNNING");
  assert.equal((await authority.claimGrantStep({
    grantId: grant.grantId, stepNumber: 2, targetAgentId: "AGENT-AFRIDEBUG-001", capabilityId: "debug.analyze"
  })).status, "RUNNING");

  advance(1001);
  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId, stepNumber: 3, targetAgentId: "AGENT-AFRIDEBUG-001", capabilityId: "debug.analyze"
  }), null);
  assert.equal(authority.repository.grants.get(grant.grantId).status, "ACTIVE");
  assert.deepEqual(authority.repository.grantSteps.get(grant.grantId).map(step => step.status), ["RUNNING", "RUNNING", "SKIPPED"]);

  await authority.completeGrantStep({ grantId: grant.grantId, stepNumber: 1, resultHash: "d".repeat(64) });
  assert.equal(authority.repository.grants.get(grant.grantId).status, "ACTIVE");
  assert.deepEqual(authority.repository.grantSteps.get(grant.grantId).map(step => step.status), ["COMPLETED", "RUNNING", "SKIPPED"]);

  await authority.completeGrantStep({ grantId: grant.grantId, stepNumber: 2, resultHash: "e".repeat(64) });
  assert.equal(authority.repository.grants.get(grant.grantId).status, "EXPIRED");
  assert.deepEqual(authority.repository.grantSteps.get(grant.grantId).map(step => step.status), ["COMPLETED", "COMPLETED", "SKIPPED"]);
});

test("allows an in-flight step to settle after grant expiry and skips pending work", async () => {
  const { authority, advance } = setup({ grantTtlMs: 1000 });
  const plan = makePlan();
  plan.steps.push({
    step: 2,
    agentId: "AGENT-AFRIDEBUG-001",
    capability: "debug.analyze",
    task: "Analyze the completed research"
  });
  const { grant } = await createApprovedGrant(authority, plan);

  const claimed = await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });
  assert.equal(claimed.status, "RUNNING");

  advance(1001);
  assert.equal(await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 2,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze"
  }), null);

  assert.equal(authority.repository.grants.get(grant.grantId).status, "ACTIVE");
  assert.deepEqual(
    authority.repository.grantSteps.get(grant.grantId).map(step => step.status),
    ["RUNNING", "SKIPPED"]
  );

  const completed = await authority.completeGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    resultHash: "c".repeat(64)
  });
  assert.equal(completed.status, "COMPLETED");
  assert.equal(authority.repository.grants.get(grant.grantId).status, "EXPIRED");
  assert.deepEqual(
    authority.repository.grantSteps.get(grant.grantId).map(step => step.status),
    ["COMPLETED", "SKIPPED"]
  );
});

test("rolls back all in-flight expiry changes when a skip audit write fails", async () => {
  let failSkipAudit = false;
  const { authority, advance } = setup({
    grantTtlMs: 1000,
    auditRepository: {
      async appendAuditEvent(event) {
        if (failSkipAudit && event.eventType === "AGENT_EXECUTION_STEP_SKIPPED") {
          throw new Error("SKIP_AUDIT_FAILED");
        }
      }
    }
  });
  const plan = makePlan();
  plan.steps.push({
    step: 2,
    agentId: "AGENT-AFRIDEBUG-001",
    capability: "debug.analyze",
    task: "Analyze the completed research"
  });
  const { grant } = await createApprovedGrant(authority, plan);

  await authority.claimGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    targetAgentId: "AGENT-AFRIREA-001",
    capabilityId: "research.analyze"
  });

  advance(1001);
  failSkipAudit = true;
  await assert.rejects(authority.completeGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    resultHash: "d".repeat(64)
  }), { message: "SKIP_AUDIT_FAILED" });

  assert.equal(authority.repository.grants.get(grant.grantId).status, "ACTIVE");
  assert.deepEqual(
    authority.repository.grantSteps.get(grant.grantId).map(step => step.status),
    ["RUNNING", "PENDING"]
  );

  failSkipAudit = false;
  const completed = await authority.completeGrantStep({
    grantId: grant.grantId,
    stepNumber: 1,
    resultHash: "d".repeat(64)
  });
  assert.equal(completed.status, "COMPLETED");
  assert.equal(authority.repository.grants.get(grant.grantId).status, "EXPIRED");
  assert.deepEqual(
    authority.repository.grantSteps.get(grant.grantId).map(step => step.status),
    ["COMPLETED", "SKIPPED"]
  );
});


test("memory repository rejects completion and failure after the execution lease expires", async () => {
  for (const action of ["completeExecutionGrantStep", "failExecutionGrantStep"]) {
    for (const leaseExpiresAt of [null, undefined, "50000", 20000]) {
      const repository = new AfriAgentApprovalMemoryRepository();
      repository.grants = new Map([["grant-1", {
        grantId: "grant-1",
        status: "ACTIVE",
        expiresAt: 90000,
        sourceAgentId: "AGENT-AFRIAICOMMAND-001",
        objective: "Objective",
        summary: "Summary"
      }]]);
      const step = {
        grantId: "grant-1",
        stepNumber: 1,
        status: "RUNNING",
        targetAgentId: "AGENT-AFRIDEBUG-001",
        capabilityId: "debug.analyze",
        task: "Inspect",
        dependsOn: [],
        leaseExpiresAt
      };
      repository.grantSteps = new Map([["grant-1", [step]]]);

      const result = await repository[action]({
        grantId: "grant-1",
        stepNumber: 1,
        now: 20000,
        resultHash: "a".repeat(64),
        errorCode: "TEST_FAILURE",
        writeAuditEvent: async () => {}
      });

      assert.equal(result, null, `${action} must reject lease ${String(leaseExpiresAt)}`);
      assert.equal(step.status, "RUNNING");
    }
  }
});
