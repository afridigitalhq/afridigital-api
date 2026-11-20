import test from "node:test";
import assert from "node:assert/strict";
import { buildAfriAICommandPlan, validateAfriAICommandPlan } from "./AfriAICommandPlanner.js";

const agents = [
  {
    id: "AGENT-AFRIFOREX-001",
    name: "AfriForex",
    key: "afriforex",
    status: "ACTIVE",
    capabilities: ["market.analyze"]
  },
  {
    id: "AGENT-AFRIREA-001",
    name: "AfriREA Agent",
    key: "afrirea",
    status: "ACTIVE",
    capabilities: ["research.analyze"]
  },
  {
    id: "AGENT-DISABLED-001",
    name: "Disabled Agent",
    status: "SUSPENDED",
    capabilities: ["market.analyze"]
  }
];

const capabilities = [
  {
    id: "market.analyze",
    service: "AfriForex",
    description: "Analyze forex crypto commodities and stocks",
    enabled: true
  },
  {
    id: "research.analyze",
    service: "AfriREA",
    description: "Research public websites and analyze HTML",
    enabled: true
  }
];

test("plans against live registered capabilities", () => {
  const result = buildAfriAICommandPlan({
    objective: "Analyze forex market conditions",
    agents,
    capabilities
  });

  assert.equal(result.status, "PREVIEW");
  assert.equal(result.executionStarted, false);
  assert.equal(result.requiresApprovalBeforeDelegation, true);
  assert.equal(result.executionChannel, "INTERNAL_ADMIN");
  assert.equal(result.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
  assert.equal(result.steps[0].candidates[0].agentId, "AGENT-AFRIFOREX-001");
});

test("excludes suspended agents and disabled capabilities", () => {
  const result = buildAfriAICommandPlan({
    objective: "Analyze forex market conditions",
    agents,
    capabilities: capabilities.map(item => ({
      ...item,
      enabled: false
    }))
  });

  assert.equal(result.candidateCount, 0);
});

test("does not select AfriAICommand itself", () => {
  const result = buildAfriAICommandPlan({
    objective: "AfriAICommand execute internal command",
    requesterAgentId: "AGENT-AFRIAICOMMAND-001",
    agents: [{
      id: "AGENT-AFRIAICOMMAND-001",
      name: "AfriAICommand Agent",
      status: "ACTIVE",
      capabilities: ["afriaicommand.execute"]
    }],
    capabilities: [{
      id: "afriaicommand.execute",
      description: "Execute internal command",
      enabled: true
    }]
  });

  assert.equal(result.candidateCount, 0);
});

test("validated structured proposals require independent trusted approval", () => {
  const result = validateAfriAICommandPlan({
    objective: "Analyze forex market conditions",
    proposedPlan: {
      summary: "Analyze current market conditions",
      steps: [{
        agentId: "AGENT-AFRIFOREX-001",
        capability: "market.analyze",
        task: "Analyze forex market conditions",
        dependsOn: []
      }]
    },
    agents,
    capabilities
  });

  assert.equal(result.status, "PREVIEW");
  assert.equal(result.planningMode, "AI_STRUCTURED");
  assert.equal(result.executionStarted, false);
  assert.equal(result.requiresApprovalBeforeDelegation, true);
  assert.match(result.message, /independent trusted approval/i);
});

test("rejects empty objectives", () => {
  assert.throws(
    () => buildAfriAICommandPlan({ objective: " " }),
    { message: "AFRIAICOMMAND_OBJECTIVE_REQUIRED" }
  );
});
