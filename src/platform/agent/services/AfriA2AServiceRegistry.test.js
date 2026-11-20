import test from "node:test";
import assert from "node:assert/strict";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriAICoderA2AService from "./AfriAICoderA2AService.js";
import AfriA2AServiceRegistry from "./AfriA2AServiceRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import AfriArchiA2AService from "./AfriArchiA2AService.js";

test("initialization secures pre-existing AfriAICoder capabilities", () => {
  const definition = AfriAICoderA2AService.capabilities[0];
  AfriAgentCapabilityRegistry.upsert({
    ...definition,
    handler: async () => ({ unsafe: true }),
    enabled: true,
    adminOnly: true,
    internalOnly: false
  });
  AfriA2AServiceRegistry.initialize();
  const capability = AfriAgentCapabilityRegistry.get(definition.id);
  assert.equal(capability.handler, AfriAICoderA2AService.execute);
  assert.equal(capability.enabled, true);
  assert.equal(capability.adminOnly, false);
  assert.equal(capability.internalOnly, true);
  for (const item of AfriAICoderA2AService.capabilities) {
    const registered = AfriAgentCapabilityRegistry.get(item.id);
    assert.ok(registered);
    assert.equal(registered.enabled, item.id === "engineering.backend");
    assert.equal(registered.internalOnly, true);
    assert.equal(registered.adminOnly, false);
    assert.equal(registered.handler, AfriAICoderA2AService.execute);
  }
});


test("registers AfriArchi as a disabled internal-only capability", () => {
  assert.equal(AfriAgentProfiles.afriarchi.id, "AGENT-AFRIARCHI-001");
  assert.equal(AfriAgentProfiles.afriarchi.name, "AfriArchi Agent");
  assert.deepEqual(AfriAgentProfiles.afriarchi.capabilities, ["architecture.design"]);

  AfriAgentCapabilityRegistry.upsert({
    id: "architecture.design",
    handler: async () => ({ unsafe: true }),
    enabled: true,
    adminOnly: true,
    internalOnly: false
  });

  AfriA2AServiceRegistry.initialize();

  const capability = AfriAgentCapabilityRegistry.get("architecture.design");
  assert.equal(capability.handler, AfriArchiA2AService.design);
  assert.equal(capability.enabled, false);
  assert.equal(capability.adminOnly, false);
  assert.equal(capability.internalOnly, true);
});

test("AfriArchi scaffold rejects execution until its design engine exists", async () => {
  await assert.rejects(
    AfriArchiA2AService.design({}, {}),
    /AFRIARCHI_ENGINE_NOT_IMPLEMENTED/
  );
});
