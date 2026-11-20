import test from "node:test";
import assert from "node:assert/strict";
import Provider from "./AfriAgentCapabilityHandlerProvider.js";
import IdentityRegistry from "../../identity/AfriAgentIdentityRegistry.js";

test("forwards structured payload and trusted identity metadata to capability handler", async () => {
  let received;
  const result = await Provider.execute({
    agent: { id: "AGENT-PROVIDER-TEST-001" },
    capability: {
      id: "provider.test.execute",
      handler: async (payload, context) => {
        received = { payload, context };
        return { ok: true };
      }
    },
    task: { payload: { message: "hello" } },
    context: { taskId: "TASK-PROVIDER-001" }
  });

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(received.payload, { message: "hello" });
  assert.equal(received.context.agentId, "AGENT-PROVIDER-TEST-001");
  assert.equal(received.context.capability, "provider.test.execute");
  assert.equal(received.context.taskId, "TASK-PROVIDER-001");
});

test("maps a plain task objective into a generic payload", async () => {
  let received;
  await Provider.execute({
    agent: { id: "AGENT-PROVIDER-TEST-002" },
    capability: {
      id: "provider.test.objective",
      handler: async payload => {
        received = payload;
        return true;
      }
    },
    task: { objective: "Inspect this service" }
  });

  assert.deepEqual(received, { objective: "Inspect this service" });
});

test("rejects capabilities without an executable handler", async () => {
  await assert.rejects(
    Provider.execute({
      agent: { id: "AGENT-PROVIDER-TEST-003" },
      capability: { id: "provider.test.missing" },
      task: {}
    }),
    { message: "AFRI_HARNESS_PROVIDER_HANDLER_UNAVAILABLE" }
  );
});

test("binds a provider without replacing existing Agent identity state", () => {
  const id = "AGENT-PROVIDER-BIND-TEST-001";
  const agent = IdentityRegistry.register({
    id,
    name: "Provider Binding Test Agent",
    provider: null,
    capabilities: ["provider.bind.test"]
  });

  const bound = IdentityRegistry.bindProvider(id, "shared-capability-handler-provider");

  assert.notEqual(bound, agent);
  assert.equal(agent.provider, null);
  assert.equal(bound.provider, "shared-capability-handler-provider");
  assert.equal(IdentityRegistry.get(id).provider, "shared-capability-handler-provider");
  assert.equal(bound.status, "ACTIVE");
  assert.deepEqual(bound.capabilities, ["provider.bind.test"]);
});

test("does not silently replace an existing Agent provider", () => {
  const id = "AGENT-PROVIDER-CONFLICT-TEST-001";
  IdentityRegistry.register({
    id,
    provider: "existing-provider",
    capabilities: []
  });

  assert.throws(
    () => IdentityRegistry.bindProvider(id, "different-provider"),
    { message: "AFRI_AGENT_IDENTITY_PROVIDER_CONFLICT" }
  );
});
