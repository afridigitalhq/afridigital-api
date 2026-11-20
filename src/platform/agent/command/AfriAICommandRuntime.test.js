import test from "node:test";
import assert from "node:assert/strict";
import { createAfriAICommandRuntime } from "./AfriAICommandRuntime.js";
import { buildAfriAICommandPlanWithAI } from "./AfriAICommandPlanner.js";
import AfriAgentDelegationExecutor from "../harness/orchestration/AfriAgentDelegationExecutor.js";

const AGENT_ID = "AGENT-AFRIAICOMMAND-001";
const PROVIDER_ID = "afriaicommand-command-provider";
const CAPABILITY_ID = "afriaicommand.execute";

function createFixture({ reasoner } = {}) {
  const agents = new Map([
    ["AGENT-AFRIFOREX-001", {
      id: "AGENT-AFRIFOREX-001",
      name: "AfriForex",
      key: "afriforex",
      status: "ACTIVE",
      capabilities: ["market.analyze"]
    }]
  ]);

  const capabilities = new Map([
    ["market.analyze", {
      id: "market.analyze",
      service: "AfriForex",
      description: "Analyze market conditions.",
      enabled: true,
      adminOnly: false
    }]
  ]);

  const providers = new Map();

  const identityRegistry = {
    get: id => agents.get(id) || null,
    list: () => [...agents.values()],
    bindProvider(id, providerId) {
      const agent = agents.get(id);
      if (!agent) throw new Error("AGENT_NOT_FOUND");
      if (agent.provider && agent.provider !== providerId) {
        throw new Error("AFRI_AGENT_IDENTITY_PROVIDER_CONFLICT");
      }
      agent.provider = providerId;
      return agent;
    },
    register(input) {
      const agent = {
        ...input,
        status: "ACTIVE"
      };
      agents.set(agent.id, agent);
      return agent;
    }
  };

  const capabilityRegistry = {
    get: id => capabilities.get(id) || null,
    list: () => [...capabilities.values()],
    register(input) {
      capabilities.set(input.id, input);
      return input;
    }
  };

  const harnessRuntime = {
    getProvider: id => providers.get(id) || null,
    registerProvider(id, provider) {
      if (providers.has(id)) {
        throw new Error("DUPLICATE_PROVIDER");
      }
      providers.set(id, provider);
      return { providerId: id, registered: true };
    },
    createInternalExecutor({ sourceAgentId, sourceCapabilityId }) {
      assert.equal(sourceAgentId, AGENT_ID);
      assert.equal(sourceCapabilityId, CAPABILITY_ID);
      return async request => {
        assert.equal(request.agentId, AGENT_ID);
        const provider = providers.get(PROVIDER_ID);
        assert.ok(provider, "Provider was not registered.");
        return provider.execute({
          task: request.task,
          context: {
            executionChannel: "INTERNAL_ADMIN",
            ...request.context
          }
        });
      };
    }
  };

  const runtime = createAfriAICommandRuntime({
    identityRegistry,
    capabilityRegistry,
    harnessRuntime,
    planner: buildAfriAICommandPlanWithAI,
    reasoner: reasoner || (async () => ({
      ok: true,
      provider: "test-reasoner",
      content: JSON.stringify({
        summary: "Analyze the market",
        steps: [{
          agentId: "AGENT-AFRIFOREX-001",
          capability: "market.analyze",
          task: "Analyze current market conditions",
          dependsOn: []
        }]
      })
    }))
  });

  return {
    runtime,
    identityRegistry,
    capabilityRegistry,
    providers
  };
}

test("initializes the command identity, capability and provider", () => {
  const fixture = createFixture();
  const result = fixture.runtime.initialize();

  assert.equal(result.initialized, true);
  assert.equal(result.agentId, AGENT_ID);
  assert.equal(result.providerId, PROVIDER_ID);

  const agent = fixture.identityRegistry.get(AGENT_ID);
  assert.equal(agent.name, "AfriAICommand Agent");
  assert.equal(agent.provider, PROVIDER_ID);
  assert.ok(agent.capabilities.includes(CAPABILITY_ID));

  const capability = fixture.capabilityRegistry.get(CAPABILITY_ID);
  assert.equal(capability.enabled, true);
  assert.equal(capability.adminOnly, false);
  assert.equal(capability.internalOnly, true);
  assert.equal(typeof capability.handler, "function");

  assert.ok(fixture.providers.has(PROVIDER_ID));
});

test("binds the provider to a pre-registered command identity", () => {
  const fixture = createFixture();
  fixture.identityRegistry.register({
    id: AGENT_ID,
    key: "afriaicommand",
    name: "AfriAICommand Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    provider: null,
    capabilities: [CAPABILITY_ID]
  });

  const result = fixture.runtime.initialize();
  assert.equal(result.initialized, true);
  assert.equal(fixture.identityRegistry.get(AGENT_ID).provider, PROVIDER_ID);
});

test("plans through the Harness and requires approval before delegation", async () => {
  const fixture = createFixture();
  fixture.runtime.initialize();

  const result = await fixture.runtime.plan("Analyze market conditions");

  assert.equal(result.status, "PREVIEW");
  assert.equal(result.executionStarted, false);
  assert.equal(result.requiresApprovalBeforeDelegation, true);
  assert.equal(result.executionChannel, "INTERNAL_ADMIN");
  assert.equal(result.paymentPolicy, "NO_AUTOMATIC_PAYMENT");
  assert.equal(result.steps.length, 1);
});

test("blocks planning when the reasoner is unavailable", async () => {
  const fixture = createFixture({
    reasoner: async () => ({
      ok: false,
      code: "TEST_REASONER_UNAVAILABLE"
    })
  });

  fixture.runtime.initialize();

  const result = await fixture.runtime.plan("Analyze market conditions");

  assert.equal(result.status, "BLOCKED");
  assert.equal(result.executionStarted, false);
});

test("execute remains a planning-only backward-compatible alias", async () => {
  const fixture = createFixture();
  fixture.runtime.initialize();

  const result = await fixture.runtime.execute("Analyze market conditions");

  assert.equal(result.status, "PREVIEW");
  assert.equal(result.executionStarted, false);
  assert.equal(result.requiresApprovalBeforeDelegation, true);
});

test("rejects non-admin execution channels", async () => {
  const fixture = createFixture();
  fixture.runtime.initialize();

  const provider = fixture.providers.get(PROVIDER_ID);

  await assert.rejects(
    provider.execute({
      task: { objective: "Attempt external execution" },
      context: { executionChannel: "PUBLIC_A2A" }
    }),
    { message: "AFRIAICOMMAND_EXECUTION_CHANNEL_FORBIDDEN" }
  );
});

test("fails closed when independent approval authority is unavailable", async () => {
  const fixture = createFixture();
  fixture.runtime.initialize();

  await assert.rejects(
    fixture.runtime.executeApproved({
      approvalId: "test-approval",
      plan: {}
    }),
    { message: "AFRIAICOMMAND_APPROVAL_AUTHORITY_UNAVAILABLE" }
  );

  assert.equal(
    fixture.runtime.executeApproved === undefined,
    false
  );
  assert.equal(
    AfriAgentDelegationExecutor.execute instanceof Function,
    true
  );
});

test("rejects an existing identity with conflicting provider configuration", () => {
  const fixture = createFixture();

  fixture.identityRegistry.register({
    id: AGENT_ID,
    name: "AfriAICommand Agent",
    provider: "unexpected-provider",
    capabilities: [CAPABILITY_ID]
  });

  assert.throws(
    () => fixture.runtime.initialize(),
    { message: "AFRIAICOMMAND_IDENTITY_CONFIGURATION_CONFLICT" }
  );
});

test("rejects an existing command capability with conflicting security configuration", () => {
  const invalidConfigurations = [
    { enabled: false, adminOnly: false, internalOnly: true },
    { enabled: true, adminOnly: true, internalOnly: true },
    { enabled: true, adminOnly: false, internalOnly: false },
    { enabled: true, adminOnly: false, internalOnly: true, handler: async () => ({ forged: true }) }
  ];

  for (const configuration of invalidConfigurations) {
    const fixture = createFixture();
    fixture.capabilityRegistry.register({
      id: CAPABILITY_ID,
      ...configuration
    });
    assert.throws(
      () => fixture.runtime.initialize(),
      { message: "AFRIAICOMMAND_CAPABILITY_CONFIGURATION_CONFLICT" }
    );
  }
});
