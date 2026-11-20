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
    authorizeApprover: options.authorizeApprover || (async ({ approverId }) => approverId === "ADMIN-1"),
    clock: () => now,
    ttlMs: options.ttlMs || 5000
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
