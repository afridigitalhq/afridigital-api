import test from "node:test";
import assert from "node:assert/strict";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import AfriAgentCardBuilder from "../identity/AfriAgentCardBuilder.js";
import AfriA2AServiceRegistry from "./AfriA2AServiceRegistry.js";
import AfriREA2AService from "./AfriREA2AService.js";

test("registers AfriREA structured research with matching identity and public skill", () => {
  const previous = process.env.AFRIREA_ENABLED;
  process.env.AFRIREA_ENABLED = "true";
  try {
    AfriA2AServiceRegistry.initialize();
    assert.deepEqual(AfriAgentProfiles.afrirea.capabilities, ["research.analyze", "research.run"]);
    assert.equal(AfriAgentCapabilityRegistry.get("research.analyze").handler, AfriREA2AService.analyze);
    assert.equal(AfriAgentCapabilityRegistry.get("research.run").handler, AfriREA2AService.research);
    assert.equal(AfriAgentCapabilityRegistry.get("research.run").enabled, true);
    const card = AfriAgentCardBuilder.build("afrirea");
    assert.ok(card);
    assert.deepEqual(card.skills.map(skill => skill.id), ["research.analyze", "research.run"]);
    assert.match(card.skills[1].description, /other source types remain unsupported/i);
  } finally {
    if (previous === undefined) delete process.env.AFRIREA_ENABLED;
    else process.env.AFRIREA_ENABLED = previous;
  }
});

test("disables both AfriREA capabilities when the feature flag is off", () => {
  const previous = process.env.AFRIREA_ENABLED;
  delete process.env.AFRIREA_ENABLED;
  try {
    AfriA2AServiceRegistry.initialize();
    assert.equal(AfriAgentCapabilityRegistry.get("research.analyze").enabled, false);
    assert.equal(AfriAgentCapabilityRegistry.get("research.run").enabled, false);
  } finally {
    if (previous === undefined) delete process.env.AFRIREA_ENABLED;
    else process.env.AFRIREA_ENABLED = previous;
  }
});
