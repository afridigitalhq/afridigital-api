import test from "node:test";
import assert from "node:assert/strict";
import Catalogue from "./AfriAICoderEconomyCatalogue.js";

test("catalogues all eight AfriAICoder engineering services", () => {
  assert.equal(Catalogue.agentId, "AGENT-AFRIAICODER-001");
  assert.equal(Catalogue.serviceCount, 8);
  assert.equal(Catalogue.list().length, 8);
  assert.equal(new Set(Catalogue.list().map(item => item.capability)).size, 8);
});

test("keeps every service pending until pricing is explicitly approved", () => {
  for (const entry of Catalogue.list()) {
    assert.equal(entry.status, "PENDING_PRICING_APPROVAL");
    assert.equal(entry.pricing, null);
    assert.equal(entry.agentId, "AGENT-AFRIAICODER-001");
  }
});

test("supports exact capability lookup without activating a service", () => {
  const entry = Catalogue.getByCapability("engineering.android");
  assert.ok(entry);
  assert.equal(entry.status, "PENDING_PRICING_APPROVAL");
  assert.equal(Catalogue.getByCapability("wallet.transfer"), null);
});

test("does not expose wallet or payment authority", () => {
  assert.equal("wallet" in Catalogue, false);
  assert.equal("paymentAuthority" in Catalogue, false);
});
