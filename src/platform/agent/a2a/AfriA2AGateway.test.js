import test from "node:test";
import assert from "node:assert/strict";
import AfriA2AGateway from "./AfriA2AGateway.js";
test("A2A gateway rejects non-external or missing request origins",async()=>{for(const requestOrigin of ["INTERNAL","UNTRUSTED",undefined]){const request={taskId:"gateway-origin-guard-test",agentId:"AGENT-TEST",capability:"test.capability"};if(requestOrigin!==undefined)request.requestOrigin=requestOrigin;const response=await AfriA2AGateway.handle(request);assert.equal(response.ok,false);assert.equal(response.error.code,"INVALID_REQUEST");assert.equal(response.error.message,"A2A gateway accepts external requests only");}});

test("A2A gateway blocks external execution before authorization and task runtime while payments are disabled", async () => {
  const response = await AfriA2AGateway.handle({
    taskId: "gateway-payment-disabled-test",
    agentId: "AGENT-TEST",
    capability: "test.capability",
    requestOrigin: "EXTERNAL",
    payment: { amount: 999 },
    settlement: { requested: true }
  });
  assert.equal(response.ok, false);
  assert.equal(response.error.code, "A2A_EXECUTION_DISABLED_NO_PAYMENT_POLICY");
  assert.equal(response.error.message, "External A2A task execution is temporarily disabled while payment operations are disabled.");
});
