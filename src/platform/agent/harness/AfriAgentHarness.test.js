import test from "node:test";
import assert from "node:assert/strict";
import { validateAfriAgentDefinition } from "./definitions/AfriAgentDefinition.js";
import AfriAgentLifecycle from "./lifecycle/AfriAgentLifecycle.js";
import AfriAgentHarnessRuntime from "./runtime/AfriAgentHarnessRuntime.js";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";

test("validates and freezes declarative agent definitions", () => {
  const definition = validateAfriAgentDefinition({
    id: "AGENT-TEST-001",
    key: "test-agent",
    name: "Test Agent",
    capabilities: ["test.execute"]
  });

  assert.equal(definition.initialStatus, "PENDING");
  assert.equal(definition.trustDomain, "EXTERNAL");
  assert.ok(Object.isFrozen(definition));
  assert.ok(Object.isFrozen(definition.capabilities));
});

test("does not allow a definition to self-activate", () => {
  const definition = validateAfriAgentDefinition({
    id: "AGENT-TEST-010",
    key: "test-agent",
    name: "Test Agent",
    capabilities: [],
    initialStatus: "ACTIVE"
  });

  assert.equal(definition.initialStatus, "PENDING");
});

test("deep-freezes nested agent configuration", () => {
  const definition = validateAfriAgentDefinition({
    id: "AGENT-TEST-011",
    key: "test-agent",
    name: "Test Agent",
    capabilities: [],
    configuration: { limits: { tasks: 3 } }
  });

  assert.ok(Object.isFrozen(definition.configuration));
  assert.ok(Object.isFrozen(definition.configuration.limits));
});

test("rejects unsupported trust domains", () => {
  assert.throws(
    () => validateAfriAgentDefinition({
      id: "AGENT-TEST-012",
      key: "test-agent",
      name: "Test Agent",
      capabilities: [],
      trustDomain: "ADMIN"
    }),
    { message: "AFRI_AGENT_DEFINITION_TRUST_DOMAIN_INVALID" }
  );
});

test("rejects incomplete agent definitions", () => {
  assert.throws(
    () => validateAfriAgentDefinition({}),
    { message: "AFRI_AGENT_DEFINITION_ID_REQUIRED" }
  );
});

test("rejects duplicate or invalid capabilities", () => {
  assert.throws(
    () => validateAfriAgentDefinition({
      id: "AGENT-TEST-002",
      key: "test-agent",
      name: "Test Agent",
      capabilities: ["test.execute", "test.execute"]
    }),
    { message: "AFRI_AGENT_DEFINITION_CAPABILITIES_INVALID" }
  );
});

test("defaults new agent lifecycle to PENDING", () => {
  const definition = validateAfriAgentDefinition({
    id: "AGENT-TEST-003",
    key: "test-agent",
    name: "Test Agent",
    capabilities: []
  });

  assert.equal(definition.initialStatus, "PENDING");
});

test("allows controlled lifecycle transitions", () => {
  const pending = { id: "AGENT-TEST-004", status: "PENDING" };
  const active = AfriAgentLifecycle.transition(pending, "ACTIVE");
  const suspended = AfriAgentLifecycle.transition(active, "SUSPENDED");
  const revoked = AfriAgentLifecycle.transition(suspended, "REVOKED");

  assert.equal(pending.status, "PENDING");
  assert.equal(active.status, "ACTIVE");
  assert.equal(suspended.status, "SUSPENDED");
  assert.equal(revoked.status, "REVOKED");
});

test("rejects invalid lifecycle transitions", () => {
  assert.throws(
    () => AfriAgentLifecycle.transition(
      { id: "AGENT-TEST-005", status: "REVOKED" },
      "ACTIVE"
    ),
    { message: "AFRI_AGENT_LIFECYCLE_TRANSITION_FORBIDDEN" }
  );
});

test("rejects unknown lifecycle statuses", () => {
  assert.throws(
    () => AfriAgentLifecycle.transition(
      { id: "AGENT-TEST-006", status: "PENDING" },
      "UNKNOWN"
    ),
    { message: "AFRI_AGENT_LIFECYCLE_STATUS_INVALID" }
  );
});

test("executes using an agent resolved from the identity registry", async () => {
  const providerId = "test-provider-registry-execution";
  const agentId = "AGENT-HARNESS-REGISTRY-001";
  const capabilityId = "harness.registry.execute";
  let received = null;

  AfriAgentHarnessRuntime.registerProvider(providerId, {
    async execute(input) {
      received = input;
      return { ok: true, output: "registry execution completed" };
    }
  });

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Harness Registry Test Agent",
    provider: providerId,
    capabilities: [capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    handler: async () => ({ ok: true })
  });

  const result = await AfriAgentHarnessRuntime.execute({
    agentId,
    task: { type: "test", capability: capabilityId },
    context: { requestId: "REQ-HARNESS-REGISTRY-001" }
  });

  assert.deepEqual(result, {
    ok: true,
    output: "registry execution completed"
  });
  assert.equal(received.agent.id, agentId);
  assert.equal(received.capability.id, capabilityId);
  assert.equal(received.context.requestId, "REQ-HARNESS-REGISTRY-001");
});

test("rejects caller-supplied agent objects without a registered identity", async () => {
  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agent: {
        id: "AGENT-FORGED-001",
        status: "ACTIVE",
        provider: "test-provider-registry-execution",
        capabilities: ["harness.registry.execute"]
      },
      task: { capability: "harness.registry.execute" }
    }),
    { message: "AFRI_HARNESS_AGENT_REQUIRED" }
  );
});

test("rejects unknown registered agent identities", async () => {
  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId: "AGENT-HARNESS-UNKNOWN-001",
      task: { capability: "harness.registry.execute" }
    }),
    { message: "AFRI_HARNESS_AGENT_NOT_FOUND" }
  );
});

test("rejects inactive registered agents", async () => {
  const agentId = "AGENT-HARNESS-INACTIVE-001";
  const capabilityId = "harness.inactive.execute";

  const agent = AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Inactive Harness Test Agent",
    provider: "unused-provider",
    capabilities: [capabilityId]
  });
  AfriAgentIdentityRegistry.transition(agentId, "SUSPENDED");

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: capabilityId }
    }),
    { message: "AFRI_HARNESS_AGENT_NOT_ACTIVE" }
  );
});

test("rejects capabilities that are not registered", async () => {
  const agentId = "AGENT-HARNESS-MISSING-CAP-001";

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Missing Capability Test Agent",
    capabilities: ["harness.expected.execute"]
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: "harness.not-registered" }
    }),
    { message: "AFRI_HARNESS_CAPABILITY_NOT_FOUND" }
  );
});

test("rejects disabled capabilities", async () => {
  const agentId = "AGENT-HARNESS-DISABLED-001";
  const capabilityId = "harness.disabled.execute";

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Disabled Capability Test Agent",
    capabilities: [capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    enabled: false,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: capabilityId }
    }),
    { message: "AFRI_HARNESS_CAPABILITY_DISABLED" }
  );
});

test("rejects capabilities not assigned to the registered agent", async () => {
  const agentId = "AGENT-HARNESS-FORBIDDEN-001";
  const capabilityId = "harness.forbidden.execute";

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Forbidden Capability Test Agent",
    capabilities: ["harness.other.execute"]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: capabilityId }
    }),
    { message: "AFRI_HARNESS_CAPABILITY_FORBIDDEN" }
  );
});

test("rejects admin-only capabilities even when caller claims INTERNAL_ADMIN", async () => {
  const agentId = "AGENT-HARNESS-ADMIN-ONLY-001";
  const capabilityId = "harness.admin-only.execute";

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Admin Only Harness Test Agent",
    provider: "unused-admin-provider",
    capabilities: [capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    adminOnly: true,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: capabilityId },
      context: { executionChannel: "INTERNAL_ADMIN" }
    }),
    { message: "AFRI_HARNESS_ADMIN_AUTHORIZATION_REQUIRED" }
  );
});

test("rejects execution when the registered agent provider is unavailable", async () => {
  const agentId = "AGENT-HARNESS-NO-PROVIDER-001";
  const capabilityId = "harness.no-provider.execute";

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "No Provider Test Agent",
    provider: "missing-harness-provider",
    capabilities: [capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({
      agentId,
      task: { capability: capabilityId }
    }),
    { message: "AFRI_HARNESS_PROVIDER_UNAVAILABLE" }
  );
});


test("executes internal-only capabilities only through trusted internal authorization", async () => {
  const providerId = "test-provider-internal-execution";
  const agentId = "AGENT-HARNESS-INTERNAL-001";
  const capabilityId = "harness.internal.execute";
  let received;

  AfriAgentHarnessRuntime.registerProvider(providerId, {
    async execute(input) {
      received = input;
      return { ok: true };
    }
  });
  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Internal Harness Test Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    provider: providerId,
    capabilities: [capabilityId]
  });
  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    internalOnly: true,
    handler: async () => ({ ok: true })
  });

  await assert.rejects(
    AfriAgentHarnessRuntime.execute({ agentId, task: { capability: capabilityId } }),
    { message: "AFRI_HARNESS_INTERNAL_EXECUTION_REQUIRED" }
  );

  const executeInternal = AfriAgentHarnessRuntime.createInternalExecutor({
    sourceAgentId: agentId,
    sourceCapabilityId: capabilityId,
    receiptVerifier: {
      async consumeExecutionReceipt({ token, envelope }) {
        assert.equal(token, "test-execution-receipt");
        assert.equal(envelope.sourceAgentId, agentId);
        assert.equal(envelope.targetAgentId, agentId);
        assert.equal(envelope.capabilityId, capabilityId);
        assert.equal(envelope.executionChannel, "INTERNAL_ADMIN");
        assert.equal(envelope.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
        return { verified: true };
      }
    }
  });
  const result = await executeInternal({
    agentId,
    task: {
      capability: capabilityId,
      payload: { objective: "Test internal execution", dependencyResults: {} }
    },
    context: {
      sourceAgentId: "AGENT-FORGED-SOURCE",
      targetAgentId: "AGENT-FORGED-TARGET",
      executionChannel: "FORGED",
      paymentPolicy: "AUTO_CHARGE",
      grantId: "grant-test",
      stepNumber: 1,
      taskId: "task-test",
      planObjective: "Test plan objective",
      planSummary: "Test plan summary",
      step: 1,
      dependsOn: [],
      executionReceipt: "test-execution-receipt"
    }
  });

  assert.deepEqual(result, { ok: true });
  assert.equal(received.context.sourceAgentId, agentId);
  assert.equal(received.context.targetAgentId, agentId);
  assert.equal(received.context.executionChannel, "INTERNAL_ADMIN");
  assert.equal(received.context.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
  assert.equal(Object.hasOwn(received.context, "executionReceipt"), false);
});

test("rejects internal execution when receipt verification is not explicitly confirmed", async () => {
  const providerId = "test-provider-receipt-verification";
  const agentId = "AGENT-HARNESS-RECEIPT-001";
  const capabilityId = "harness.receipt.execute";
  let providerCalls = 0;

  AfriAgentHarnessRuntime.registerProvider(providerId, {
    async execute() {
      providerCalls += 1;
      return { ok: true };
    }
  });

  AfriAgentIdentityRegistry.register({
    id: agentId,
    name: "Receipt Verification Test Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    provider: providerId,
    capabilities: [capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    internalOnly: true,
    handler: async () => ({ ok: true })
  });

  for (const verification of [false, null, undefined]) {
    const executeInternal = AfriAgentHarnessRuntime.createInternalExecutor({
      sourceAgentId: agentId,
      sourceCapabilityId: capabilityId,
      receiptVerifier: {
        async consumeExecutionReceipt() {
          return verification;
        }
      }
    });

    await assert.rejects(
      executeInternal({
        agentId,
        task: {
          capability: capabilityId,
          payload: {
            objective: "Test receipt verification",
            dependencyResults: []
          }
        },
        context: {
          grantId: "grant-receipt-test",
          stepNumber: 1,
          taskId: "task-receipt-test",
          planObjective: "Test plan",
          planSummary: "Test receipt verification",
          step: 1,
          dependsOn: [],
          executionReceipt: "test-receipt-token"
        }
      }),
      { message: "AFRI_HARNESS_RECEIPT_VERIFICATION_REJECTED" }
    );
  }

  assert.equal(providerCalls, 0);
});

for (const scenario of [
  {
    name: "missing source capability",
    sourceCapabilityId: undefined,
    assigned: [],
    register: false,
    expected: "AFRI_HARNESS_SOURCE_CAPABILITY_REQUIRED"
  },
  {
    name: "unregistered source capability",
    sourceCapabilityId: "harness.source.missing",
    assigned: ["harness.source.missing"],
    register: false,
    expected: "AFRI_HARNESS_SOURCE_CAPABILITY_NOT_FOUND"
  },
  {
    name: "disabled source capability",
    sourceCapabilityId: "harness.source.disabled",
    assigned: ["harness.source.disabled"],
    enabled: false,
    expected: "AFRI_HARNESS_SOURCE_CAPABILITY_DISABLED"
  },
  {
    name: "unassigned source capability",
    sourceCapabilityId: "harness.source.unassigned",
    assigned: [],
    expected: "AFRI_HARNESS_SOURCE_CAPABILITY_FORBIDDEN"
  },
  {
    name: "admin-only source capability",
    sourceCapabilityId: "harness.source.admin",
    assigned: ["harness.source.admin"],
    adminOnly: true,
    expected: "AFRI_HARNESS_SOURCE_CAPABILITY_FORBIDDEN"
  }
]) {
  test(`internal execution rejects ${scenario.name}`, async () => {
    const sourceId = `AGENT-HARNESS-SOURCE-${scenario.name.replace(/[^a-z]/gi, "-").toUpperCase()}`;
    const targetId = `${sourceId}-TARGET`;
    const targetCapabilityId = `${sourceId}-CAPABILITY`;

    AfriAgentIdentityRegistry.register({
      id: sourceId,
      name: "Harness Source Authorization Test",
      organizationId: "afridigital",
      trustDomain: "INTERNAL",
      capabilities: scenario.assigned
    });
    AfriAgentIdentityRegistry.register({
      id: targetId,
      name: "Harness Target Authorization Test",
      organizationId: "afridigital",
      trustDomain: "INTERNAL",
      capabilities: [targetCapabilityId]
    });

    if (scenario.register !== false) {
      AfriAgentCapabilityRegistry.register({
        id: scenario.sourceCapabilityId,
        enabled: scenario.enabled !== false,
        adminOnly: scenario.adminOnly === true,
        handler: async () => ({ ok: true })
      });
    }

    AfriAgentCapabilityRegistry.register({
      id: targetCapabilityId,
      internalOnly: true,
      handler: async () => ({ ok: true })
    });

    if (scenario.sourceCapabilityId === undefined) {
      assert.throws(
        () => AfriAgentHarnessRuntime.createInternalExecutor({
          sourceAgentId: sourceId,
          sourceCapabilityId: scenario.sourceCapabilityId
        }),
        { message: scenario.expected }
      );
      return;
    }
    const executeInternal = AfriAgentHarnessRuntime.createInternalExecutor({
      sourceAgentId: sourceId,
      sourceCapabilityId: scenario.sourceCapabilityId
    });
    await assert.rejects(
      executeInternal({
        agentId: targetId,
        task: { capability: targetCapabilityId }
      }),
      { message: scenario.expected }
    );
  });
}

test("internal execution rejects cross-organization or external identities", async () => {
  const providerId = "test-provider-internal-denied";
  const sourceId = "AGENT-HARNESS-INTERNAL-SOURCE-002";
  const targetId = "AGENT-HARNESS-INTERNAL-TARGET-002";
  const capabilityId = "harness.internal.denied";

  AfriAgentHarnessRuntime.registerProvider(providerId, {
    async execute() {
      throw new Error("MUST_NOT_EXECUTE");
    }
  });
  AfriAgentIdentityRegistry.register({
    id: sourceId,
    name: "Internal Source",
    organizationId: "org-a",
    trustDomain: "INTERNAL",
    provider: providerId,
    capabilities: ["harness.internal.source"]
  });
  AfriAgentIdentityRegistry.register({
    id: targetId,
    name: "External Target",
    organizationId: "org-b",
    trustDomain: "EXTERNAL",
    provider: providerId,
    capabilities: [capabilityId]
  });
  AfriAgentCapabilityRegistry.register({
    id: "harness.internal.source",
    enabled: true,
    handler: async () => ({ ok: true })
  });
  AfriAgentCapabilityRegistry.register({
    id: capabilityId,
    internalOnly: true,
    handler: async () => ({ ok: true })
  });

  const executeInternal = AfriAgentHarnessRuntime.createInternalExecutor({
    sourceAgentId: sourceId,
    sourceCapabilityId: "harness.internal.source"
  });
  await assert.rejects(
    executeInternal({
      agentId: targetId,
      task: { capability: capabilityId }
    }),
    { message: "AFRI_HARNESS_INTERNAL_AUTHORIZATION_REQUIRED" }
  );
});
