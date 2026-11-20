import test from "node:test";
import assert from "node:assert/strict";
import { createAfriAgentIdentityRegistry } from "./AfriAgentIdentityRegistry.js";

function fixture() { return createAfriAgentIdentityRegistry(); }

test("rejects duplicate identity registration", () => {
  const registry = fixture();
  registry.register({ id: "TEST-IDENTITY-001" });
  assert.throws(() => registry.register({ id: "TEST-IDENTITY-001" }), { message: "AFRI_AGENT_IDENTITY_DUPLICATE" });
});

test("returns immutable identity and capability snapshots", () => {
  const registry = fixture();
  const created = registry.register({ id: "TEST-IDENTITY-002", capabilities: ["test.read"] });
  assert.equal(Object.isFrozen(created), true);
  assert.equal(Object.isFrozen(created.capabilities), true);
  assert.throws(() => { created.status = "REVOKED"; }, TypeError);
  assert.throws(() => { created.capabilities.push("test.write"); }, TypeError);
  assert.equal(registry.get(created.id).status, "ACTIVE");
  assert.deepEqual(registry.get(created.id).capabilities, ["test.read"]);
});

test("preserves provider binding and rejects conflicting providers", () => {
  const registry = fixture();
  registry.register({ id: "TEST-IDENTITY-003", provider: "provider-a" });
  assert.equal(registry.bindProvider("TEST-IDENTITY-003", "provider-a").provider, "provider-a");
  assert.throws(() => registry.bindProvider("TEST-IDENTITY-003", "provider-b"), { message: "AFRI_AGENT_IDENTITY_PROVIDER_CONFLICT" });
});

test("enforces lifecycle transitions and terminal revocation", () => {
  const registry = fixture();
  registry.register({ id: "TEST-IDENTITY-004" });
  assert.equal(registry.transition("TEST-IDENTITY-004", "SUSPENDED").status, "SUSPENDED");
  assert.equal(registry.transition("TEST-IDENTITY-004", "ACTIVE").status, "ACTIVE");
  assert.equal(registry.revoke("TEST-IDENTITY-004").status, "REVOKED");
  assert.equal(registry.revoke("TEST-IDENTITY-004").status, "REVOKED");
  assert.throws(() => registry.transition("TEST-IDENTITY-004", "ACTIVE"), { message: "AFRI_AGENT_LIFECYCLE_TRANSITION_FORBIDDEN" });
});

test("updates capabilities only through validated registry operation", () => {
  const registry = fixture();
  registry.register({ id: "TEST-IDENTITY-005", capabilities: ["test.read"] });
  assert.deepEqual(registry.updateCapabilities("TEST-IDENTITY-005", ["test.write"]).capabilities, ["test.write"]);
  assert.throws(() => registry.updateCapabilities("TEST-IDENTITY-005", ["test.read", "test.read"]), { message: "AFRI_AGENT_IDENTITY_CAPABILITIES_INVALID" });
  assert.deepEqual(registry.get("TEST-IDENTITY-005").capabilities, ["test.write"]);
});
