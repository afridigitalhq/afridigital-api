import test from "node:test";
import assert from "node:assert/strict";
import { validateAfriAgentExecutionPlan } from "./AfriAgentExecutionPlan.js";

const agents = [{
  id: "AGENT-TEST-001",
  name: "Test Agent",
  status: "ACTIVE",
  capabilities: ["test.execute"]
}];

const capabilities = [{
  id: "test.execute",
  enabled: true,
  adminOnly: false
}];

const validPlan = {
  summary: "Run a test task",
  steps: [{
    agentId: "AGENT-TEST-001",
    capability: "test.execute",
    task: "Execute the test"
  }]
};

function validate(proposedPlan = validPlan, overrides = {}) {
  return validateAfriAgentExecutionPlan({
    objective: "Test objective",
    proposedPlan,
    agents,
    capabilities,
    requesterAgentId: "AGENT-COMMAND-001",
    ...overrides
  });
}

test("validates and normalizes a registered execution plan", () => {
  const result = validate(validPlan);
  assert.equal(result.objective, "Test objective");
  assert.equal(result.summary, "Run a test task");
  assert.deepEqual(result.steps[0], {
    step: 1,
    agentId: "AGENT-TEST-001",
    agentName: "Test Agent",
    capability: "test.execute",
    task: "Execute the test",
    dependsOn: []
  });
});

test("rejects malformed plan objects", () => {
  assert.throws(
    () => validate(null),
    { message: "AFRI_AGENT_EXECUTION_PLAN_INVALID" }
  );
});

test("rejects missing or excessive plan steps", () => {
  assert.throws(
    () => validate({ summary: "Empty", steps: [] }),
    { message: "AFRI_AGENT_EXECUTION_PLAN_STEPS_INVALID" }
  );
  assert.throws(
    () => validate({
      summary: "Too many",
      steps: Array.from({ length: 13 }, () => validPlan.steps[0])
    }),
    { message: "AFRI_AGENT_EXECUTION_PLAN_STEPS_INVALID" }
  );
});

test("rejects admin-only capabilities", () => {
  assert.throws(
    () => validate(validPlan, {
      capabilities: [{ id: "test.execute", enabled: true, adminOnly: true }]
    }),
    { message: "AFRI_AGENT_EXECUTION_PLAN_CAPABILITY_NOT_ELIGIBLE" }
  );
});

test("rejects dependencies that are not earlier step numbers", () => {
  const twoStepPlan = {
    summary: "Two steps",
    steps: [
      validPlan.steps[0],
      { ...validPlan.steps[0], dependsOn: [2] }
    ]
  };
  assert.throws(
    () => validate(twoStepPlan),
    { message: "AFRI_AGENT_EXECUTION_PLAN_DEPENDENCY_INVALID" }
  );
});

test("rejects duplicate dependencies", () => {
  const twoStepPlan = {
    summary: "Two steps",
    steps: [
      validPlan.steps[0],
      { ...validPlan.steps[0], dependsOn: [1, 1] }
    ]
  };
  assert.throws(
    () => validate(twoStepPlan),
    { message: "AFRI_AGENT_EXECUTION_PLAN_DEPENDENCY_INVALID" }
  );
});

test("rejects invalid objectives", () => {
  assert.throws(
    () => validate(validPlan, { objective: " " }),
    { message: "AFRI_AGENT_EXECUTION_PLAN_OBJECTIVE_INVALID" }
  );
});
