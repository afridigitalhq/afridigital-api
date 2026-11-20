import assert from "node:assert/strict";
import Controller from "./AfriDebugChangeExecutionController.js";
import VerificationRuntime from "../verification/AfriDebugVerificationRuntime.js";
import RollbackRuntime from "../production/rollback/AfriDebugRollbackRuntime.js";

const originalVerify = VerificationRuntime.verify;
const rollbackCountBefore = RollbackRuntime.stats().rollbacks;

try {
  VerificationRuntime.verify = (input = {}) => ({
    id: "VERIFY-FAIL-TEST",
    patchId: input.patchId || null,
    tests: input.tests || [],
    status: "FAILED",
    reason: "TEST_FAILURE_INJECTED"
  });

  const result = Controller.execute({
    incidentId: "AFD-FAIL-001",
    patch: { id: "PATCH-FAIL-001", status: "PROPOSED" },
    tests: ["injected failure"]
  });

  assert.equal(result.status, "verification_failed");
  assert.equal(result.reason, "VERIFICATION_NOT_CONFIRMED");
  assert.equal(result.rollback, null);
  assert.equal(result.completedAt, null);
  assert.equal(RollbackRuntime.stats().rollbacks, rollbackCountBefore);

  console.log("AFRIDEBUG_CHANGE_FAILURE_TEST:PASS");
  console.log("Failed verification did not complete execution or create a rollback request.");
} finally {
  VerificationRuntime.verify = originalVerify;
}
