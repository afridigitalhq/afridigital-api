import assert from "node:assert/strict";
import test from "node:test";
import AfriAgentsEconomyPaymentRuntime from "./AfriAgentsEconomyPaymentRuntime.js";
import AfriAgentsEconomySettlementRuntime from "./AfriAgentsEconomySettlementRuntime.js";
import { PAYMENTS_ENABLED } from "./AfriAgentsEconomyPaymentPolicy.js";

const isDisabled = error => error?.code === "AFRI_ECONOMY_PAYMENTS_DISABLED";

test("AfriAgents Economy payment execution is disabled by default", () => {
  assert.equal(PAYMENTS_ENABLED, false);
  assert.throws(() => AfriAgentsEconomyPaymentRuntime.createObligation(), isDisabled);
  assert.throws(() => AfriAgentsEconomyPaymentRuntime.authorize(), isDisabled);
  assert.throws(() => AfriAgentsEconomyPaymentRuntime.complete(), isDisabled);
});

test("settlement and reconciliation are blocked before payment or network access", async () => {
  await assert.rejects(AfriAgentsEconomySettlementRuntime.settle(), isDisabled);
  await assert.rejects(AfriAgentsEconomySettlementRuntime.reconcile(), isDisabled);
});

test("safe cancellation and read-only payment history APIs remain available", () => {
  assert.equal(typeof AfriAgentsEconomyPaymentRuntime.cancel, "function");
  assert.equal(typeof AfriAgentsEconomyPaymentRuntime.get, "function");
  assert.equal(typeof AfriAgentsEconomyPaymentRuntime.list, "function");
});
