import test from "node:test";
import assert from "node:assert/strict";
import {
  createAfriAgentApprovalRuntime
} from "./AfriAgentApprovalRuntime.js";

test("creates PostgreSQL approval authority and injected delegation executor", async () => {
  let schemaCalls = 0;
  const events = [];
  const pool = {
    async query(sql) {
      schemaCalls++;
      events.push(`SCHEMA_${schemaCalls}`);
      assert.match(sql, /CREATE TABLE IF NOT EXISTS (afri_agent_approvals|afri_agent_artifacts|afri_agent_artifact_approvals)/);
      return { rows: [] };
    },
    async connect() {
      return {
        async query(sql) {
          const command = sql.trim().split(/\\s+/)[0].toUpperCase();
          events.push(command);
          return { rows: [] };
        },
        release() {}
      };
    }
  };
  const sessionService = {
    async verifyPrincipal() {
      return null;
    }
  };

  const runtime = await createAfriAgentApprovalRuntime({
    pool,
    sessionService,
    auditRepository: { async appendAuditEvent() {} },
    executionLeaseMs: 60000
  });
  assert.equal(schemaCalls, 3);
  assert.ok(events.indexOf("COMMIT") >= 0);
  assert.ok(events.indexOf("COMMIT") < events.indexOf("SCHEMA_2"));
  assert.equal(runtime.authority.executionLeaseMs, 60000);
  assert.equal(typeof runtime.authority.request, "function");
  assert.equal(typeof runtime.authority.approve, "function");
  assert.equal(typeof runtime.authority.reject, "function");
  assert.equal(typeof runtime.authority.consume, "function");
  assert.equal(typeof runtime.delegationExecutor.execute, "function");
  assert.equal(typeof runtime.commandRuntime.initialize, "function");
  assert.equal(typeof runtime.commandRuntime.executeApproved, "function");
  assert.equal(typeof runtime.artifactRepository.registerVersion, "function");
  assert.equal(typeof runtime.artifactRepository.getArtifact, "function");
  assert.equal(typeof runtime.artifactApprovalRepository.consumeApproved, "function");
  assert.equal(typeof runtime.artifactApprovalAuthority.request, "function");
  assert.equal(typeof runtime.artifactApprovalAuthority.approve, "function");
  assert.equal(typeof runtime.artifactApprovalAuthority.reject, "function");
  assert.equal(typeof runtime.artifactApprovalAuthority.consume, "function");
  assert.equal(runtime.sessionService, sessionService);
  assert.equal(Object.isFrozen(runtime), true);
});

test("refuses to create approval runtime without PostgreSQL", async () => {
  await assert.rejects(
    createAfriAgentApprovalRuntime({ sessionService: { verifyPrincipal() {} } }),
    { message: "AFRI_APPROVAL_POSTGRES_POOL_REQUIRED" }
  );
});

test("refuses to create approval runtime without AfriIdentity verification", async () => {
  await assert.rejects(
    createAfriAgentApprovalRuntime({ pool: { query: async () => ({ rows: [] }) } }),
    { message: "AFRI_APPROVAL_IDENTITY_SERVICE_REQUIRED" }
  );
});
