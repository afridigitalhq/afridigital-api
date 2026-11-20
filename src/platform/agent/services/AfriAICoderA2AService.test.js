import test from "node:test";
import assert from "node:assert/strict";
import AfriAICoderA2AService, {
  createAfriAICoderA2AService
} from "./AfriAICoderA2AService.js";

const agentId = "AGENT-AFRIAICODER-001";

function trustedContext(overrides = {}) {
  return {
    agentId,
    capability: "engineering.backend",
    taskId: "task-test-001",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    ...overrides
  };
}

test("registers eight distinct engineering capabilities", () => {
  assert.equal(AfriAICoderA2AService.capabilities.length, 8);
  assert.equal(
    new Set(AfriAICoderA2AService.capabilities.map(item => item.id)).size,
    8
  );
  assert.ok(
    AfriAICoderA2AService.capabilities.every(
      item => item.service === "AfriAICoder" && item.description
    )
  );
});

test("does not execute jobs before an adapter is configured", async () => {
  await assert.rejects(
    AfriAICoderA2AService.execute(
      { objective: "Implement a bounded backend change." },
      trustedContext()
    ),
    { message: "AFRIAICODER_EXECUTION_ADAPTER_NOT_CONFIGURED" }
  );
});

test("rejects capabilities outside the registered engineering catalogue", async () => {
  const service = createAfriAICoderA2AService({
    adapter: { execute: async () => ({ ok: true }) }
  });

  await assert.rejects(
    service.execute(
      { objective: "Test capability validation." },
      trustedContext({ capability: "wallet.transfer" })
    ),
    { message: "AFRIAICODER_CAPABILITY_NOT_FOUND" }
  );
});

test("rejects missing or forged trusted coder identity", async () => {
  const service = createAfriAICoderA2AService({
    adapter: { execute: async () => ({ ok: true }) }
  });

  await assert.rejects(
    service.execute(
      { objective: "Test identity." },
      trustedContext({ agentId: "AGENT-ATTACKER-001" })
    ),
    { message: "AFRIAICODER_TRUSTED_IDENTITY_INVALID" }
  );
});

test("passes validated task and trusted context to the injected adapter", async () => {
  let received;

  const service = createAfriAICoderA2AService({
    adapter: {
      async execute(input) {
        received = input;
        return { status: "PATCH_PROPOSAL_READY" };
      }
    }
  });

  const result = await service.execute(
    {
      objective: "Implement the AfriREA URL validation improvement.",
      dependencyResults: [{ step: 1, status: "PASSED" }],
      agentId: "AGENT-ATTACKER-001",
      capability: "wallet.transfer"
    },
    trustedContext()
  );

  assert.deepEqual(result, { status: "PATCH_PROPOSAL_READY" });
  assert.equal(received.agentId, agentId);
  assert.equal(received.capability, "engineering.backend");
  assert.equal(
    received.task.objective,
    "Implement the AfriREA URL validation improvement."
  );
  assert.deepEqual(
    received.task.dependencyResults,
    [{ step: 1, status: "PASSED" }]
  );
  assert.equal(
    received.context.sourceAgentId,
    "AGENT-AFRIAICOMMAND-001"
  );
  assert.equal(received.context.executionChannel, "INTERNAL_ADMIN");
  assert.equal(
    received.context.paymentPolicy,
    "NO_AUTOMATIC_PAYMENT"
  );
  assert.equal("agentId" in received.task, false);
  assert.equal("capability" in received.task, false);
});

test("rejects invalid objectives and oversized dependency lists", async () => {
  const service = createAfriAICoderA2AService({
    adapter: { execute: async () => ({ ok: true }) }
  });

  await assert.rejects(
    service.execute({ objective: " " }, trustedContext()),
    { message: "AFRIAICODER_OBJECTIVE_INVALID" }
  );

  await assert.rejects(
    service.execute({ objective: "x".repeat(2001) }, trustedContext()),
    { message: "AFRIAICODER_OBJECTIVE_INVALID" }
  );

  await assert.rejects(
    service.execute(
      {
        objective: "Test dependency limit.",
        dependencyResults: Array(13).fill({})
      },
      trustedContext()
    ),
    { message: "AFRIAICODER_DEPENDENCY_RESULTS_INVALID" }
  );
});

test("supports explicit adapter configuration and fail-closed reset", async () => {
  const service = createAfriAICoderA2AService();

  assert.equal(service.isExecutionAdapterConfigured(), false);

  service.configureExecutionAdapter({
    execute: async () => ({ status: "TEST_ADAPTER_EXECUTED" })
  });

  assert.equal(service.isExecutionAdapterConfigured(), true);

  assert.deepEqual(
    await service.execute(
      { objective: "Run adapter configuration test." },
      trustedContext()
    ),
    { status: "TEST_ADAPTER_EXECUTED" }
  );

  service.clearExecutionAdapter();

  assert.equal(service.isExecutionAdapterConfigured(), false);

  await assert.rejects(
    service.execute(
      { objective: "Must fail closed." },
      trustedContext()
    ),
    { message: "AFRIAICODER_EXECUTION_ADAPTER_NOT_CONFIGURED" }
  );
});
