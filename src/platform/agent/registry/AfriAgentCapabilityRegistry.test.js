import test from "node:test";
import assert from "node:assert/strict";
import { createAfriAgentCapabilityRegistry } from "./AfriAgentCapabilityRegistry.js";

test("register rejects duplicate capability identifiers", () => {
  const registry = createAfriAgentCapabilityRegistry();
  registry.register({ id: "registry.duplicate" });
  assert.throws(
    () => registry.register({ id: "registry.duplicate" }),
    /A2A_CAPABILITY_ALREADY_REGISTERED/
  );
});

test("get returns immutable capability snapshots", () => {
  const registry = createAfriAgentCapabilityRegistry();
  const handler = async () => ({ ok: true });
  const capability = registry.register({
    id: "registry.immutable",
    handler,
    enabled: true,
    internalOnly: true
  });

  assert.ok(Object.isFrozen(capability));
  assert.throws(() => { capability.enabled = false; }, TypeError);
  assert.equal(registry.get("registry.immutable").enabled, true);
  assert.equal(registry.get("registry.immutable").handler, handler);
});

test("update replaces definitions without changing identity or registration time", () => {
  const registry = createAfriAgentCapabilityRegistry();
  const original = registry.register({ id: "registry.update", enabled: true });
  const updated = registry.update("registry.update", {
    enabled: false,
    internalOnly: true
  });

  assert.notEqual(updated, original);
  assert.equal(updated.registeredAt, original.registeredAt);
  assert.equal(updated.enabled, false);
  assert.equal(updated.internalOnly, true);
  assert.throws(
    () => registry.update("registry.update", { id: "registry.other" }),
    /A2A_CAPABILITY_ID_IMMUTABLE/
  );
});

test("enable and disable replace immutable records", () => {
  const registry = createAfriAgentCapabilityRegistry();
  const original = registry.register({ id: "registry.toggle", enabled: true });
  const disabled = registry.disable("registry.toggle");
  const enabled = registry.enable("registry.toggle");

  assert.equal(original.enabled, true);
  assert.equal(disabled.enabled, false);
  assert.equal(enabled.enabled, true);
  assert.notEqual(original, disabled);
  assert.notEqual(disabled, enabled);
});

test("upsert deliberately replaces an existing capability", () => {
  const registry = createAfriAgentCapabilityRegistry();
  registry.register({ id: "registry.upsert", enabled: true });
  const updated = registry.upsert({
    id: "registry.upsert",
    enabled: false,
    internalOnly: true
  });

  assert.equal(updated.enabled, false);
  assert.equal(updated.internalOnly, true);
});
