import test from "node:test";
import assert from "node:assert/strict";
import { markAfriAgentPlatformReady, getAfriAgentPlatformReadiness } from "./AfriAgentPlatformReadiness.js";
function setup(query) {
  const commandRuntime = { plan() {}, executeApproved() {} };
  const pool = { query };
  markAfriAgentPlatformReady({ postgresPool: pool, afriIdentity: { sessionService: { verifyPrincipal() {} } }, approvalRuntime: { authority: {}, delegationExecutor: {}, commandRuntime }, commandRuntime, commandStatus: { initialized: true, agentId: "AGENT-AFRIAICOMMAND-001", providerId: "afriaicommand-command-provider", capability: "afriaicommand.execute", executionChannel: "INTERNAL_ADMIN" } });
  return pool;
}
test("readiness fails closed before initialization", async () => { const result = await getAfriAgentPlatformReadiness(); assert.equal(result.status, "NOT_READY"); assert.equal(result.ready, false); });
test("readiness rejects missing prerequisites", () => { assert.throws(() => markAfriAgentPlatformReady({}), /AFRI_AGENT_PLATFORM_READINESS_CHECK_FAILED/); });
test("readiness reports READY after a successful live database probe", async () => {
  let config;
  setup(async value => { config = value; return { rows: [{ "?column?": 1 }] }; });
  const result = await getAfriAgentPlatformReadiness();
  assert.equal(config.text, "SELECT 1");
  assert.equal(config.query_timeout, 1500);
  assert.equal(result.status, "READY");
  assert.equal(result.ready, true);
  assert.deepEqual(result.checks, { database: true, identity: true, approval: true, command: true });
  assert.ok(result.timestamp);
});
test("readiness fails closed when the live database query fails", async () => {
  setup(async () => { throw new Error("private database failure"); });
  const result = await getAfriAgentPlatformReadiness();
  assert.equal(result.status, "NOT_READY");
  assert.equal(result.ready, false);
  assert.equal(result.checks.database, false);
  assert.equal(JSON.stringify(result).includes("private database failure"), false);
});
test("readiness fails closed when the database probe times out", async () => {
  setup(() => new Promise(() => {}));
  const result = await getAfriAgentPlatformReadiness({ timeoutMs: 10 });
  assert.equal(result.status, "NOT_READY");
  assert.equal(result.ready, false);
  assert.equal(result.checks.database, false);
});