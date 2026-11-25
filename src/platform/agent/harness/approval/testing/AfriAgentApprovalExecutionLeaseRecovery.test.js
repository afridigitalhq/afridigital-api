import test from "node:test";
import assert from "node:assert/strict";
import { AfriAgentApprovalPostgresRepository } from "../AfriAgentApprovalPostgresRepository.js";

function recoveryFixture({ expiresAt = 50000, steps = [] } = {}) {
  const calls = [];
  const grant = { grant_id: "grant-1", status: "ACTIVE", expires_at: String(expiresAt) };
  const rows = steps.map((step, index) => ({
    grant_id: "grant-1",
    step_number: index + 1,
    target_agent_id: "AGENT-AFRIDEBUG-001",
    capability_id: "debug.analyze",
    task: `Task ${index + 1}`,
    depends_on: [],
    status: "PENDING",
    started_at: null,
    lease_expires_at: null,
    completed_at: null,
    result_hash: null,
    ...step
  }));
  let snapshot;
  let released = false;

  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (sql === "BEGIN") {
        snapshot = { grant: { ...grant }, rows: rows.map(row => ({ ...row })) };
        return { rows: [] };
      }
      if (sql === "COMMIT") return { rows: [] };
      if (sql === "ROLLBACK") {
        Object.assign(grant, snapshot.grant);
        rows.splice(0, rows.length, ...snapshot.rows.map(row => ({ ...row })));
        return { rows: [] };
      }
      if (sql.includes("SELECT * FROM afri_agent_execution_grants")) return { rows: [{ ...grant }] };
      if (sql.includes("SELECT * FROM afri_agent_execution_grant_steps")) return { rows: rows.map(row => ({ ...row })) };

      if (sql.includes("SET status = 'FAILED'")) {
        const row = rows.find(item => item.step_number === values[1] && item.status === "RUNNING");
        if (!row) return { rows: [] };
        Object.assign(row, { status: "FAILED", result_hash: null, completed_at: values[2] });
        return { rows: [{ ...row }] };
      }
      if (sql.includes("SET status = 'SKIPPED'")) {
        const row = rows.find(item => item.step_number === values[1] && item.status === "PENDING");
        if (!row) return { rows: [] };
        Object.assign(row, { status: "SKIPPED", result_hash: null, completed_at: values[2] });
        return { rows: [{ ...row }] };
      }
      if (sql.includes("SET status = 'RUNNING'")) {
        const row = rows.find(item => item.step_number === values[1] && item.status === "PENDING");
        if (!row) return { rows: [] };
        Object.assign(row, { status: "RUNNING", started_at: values[2], lease_expires_at: values[3] });
        return { rows: [{ ...row }] };
      }
      if (sql.includes("SET status = $2")) {
        grant.status = values[1];
        return { rows: [] };
      }
      if (sql.includes("SET status = 'EXPIRED'")) {
        grant.status = "EXPIRED";
        return { rows: [] };
      }
      if (sql.includes("SELECT COUNT(*)::int AS incomplete")) return { rows: [{ incomplete: 0 }] };
      throw new Error("UNEXPECTED_RECOVERY_SQL: " + sql);
    },
    release() { released = true; }
  };

  return {
    pool: {
      async query() { throw new Error("transaction client required"); },
      async connect() { return client; }
    },
    calls,
    grant,
    rows,
    isReleased: () => released
  };
}

const audit = async (_client, event) => {
  assert.match(event.eventType, /^AGENT_EXECUTION_/);
};

test("recovers expired leases, skips dependents, and preserves independent pending work", async () => {
  const fixture = recoveryFixture({
    steps: [
      { status: "RUNNING", started_at: "10000", lease_expires_at: "11000" },
      { depends_on: [1] },
      { depends_on: [] }
    ]
  });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const events = [];
  const result = await repository.recoverExpiredExecutionGrantSteps({
    now: 11001,
    writeAuditEvent: async (client, event) => { await audit(client, event); events.push(event); }
  });

  assert.deepEqual(result, { recovered: 1, skipped: 1, grantsFinalized: 0 });
  assert.deepEqual(fixture.rows.map(row => row.status), ["FAILED", "SKIPPED", "PENDING"]);
  assert.equal(events.find(event => event.eventType === "AGENT_EXECUTION_STEP_FAILED").details.errorCode, "EXECUTION_LEASE_EXPIRED");
  assert.equal(events.find(event => event.eventType === "AGENT_EXECUTION_STEP_SKIPPED").details.errorCode, "DEPENDENCY_FAILED");
  assert.equal(fixture.grant.status, "ACTIVE");
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});

test("recovers legacy RUNNING steps whose lease expiry is NULL", async () => {
  const fixture = recoveryFixture({
    steps: [{ status: "RUNNING", started_at: "10000", lease_expires_at: null }]
  });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const events = [];
  const result = await repository.recoverExpiredExecutionGrantSteps({
    now: 11001,
    writeAuditEvent: async (client, event) => {
      await audit(client, event);
      events.push(event);
    }
  });

  assert.deepEqual(result, { recovered: 1, skipped: 0, grantsFinalized: 1 });
  assert.equal(fixture.rows[0].status, "FAILED");
  assert.equal(fixture.grant.status, "FAILED");
  assert.equal(events[0].details.errorCode, "EXECUTION_LEASE_EXPIRED");
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
});

test("rolls back expired-lease recovery when the failure audit write fails", async () => {
  const fixture = recoveryFixture({
    steps: [
      { status: "RUNNING", started_at: "10000", lease_expires_at: "11000" },
      { depends_on: [1] }
    ]
  });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  await assert.rejects(repository.recoverExpiredExecutionGrantSteps({
    now: 11001,
    writeAuditEvent: async (_client, event) => {
      if (event.eventType === "AGENT_EXECUTION_STEP_FAILED") throw new Error("failure audit unavailable");
    }
  }), /failure audit unavailable/);

  assert.equal(fixture.grant.status, "ACTIVE");
  assert.deepEqual(fixture.rows.map(row => row.status), ["RUNNING", "PENDING"]);
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
  assert.equal(fixture.calls.some(call => call.sql === "COMMIT"), false);
  assert.equal(fixture.isReleased(), true);
});

test("keeps an expired grant active while its execution lease remains valid", async () => {
  const fixture = recoveryFixture({
    expiresAt: 11000,
    steps: [
      { status: "RUNNING", started_at: "10000", lease_expires_at: "13000" },
      { depends_on: [1] }
    ]
  });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  const first = await repository.recoverExpiredExecutionGrantSteps({
    now: 11001,
    writeAuditEvent: audit
  });
  assert.deepEqual(first, { recovered: 0, skipped: 1, grantsFinalized: 0 });
  assert.equal(fixture.grant.status, "ACTIVE");
  assert.deepEqual(fixture.rows.map(row => row.status), ["RUNNING", "SKIPPED"]);

  const second = await repository.recoverExpiredExecutionGrantSteps({
    now: 13001,
    writeAuditEvent: audit
  });
  assert.deepEqual(second, { recovered: 1, skipped: 0, grantsFinalized: 1 });
  assert.equal(fixture.grant.status, "EXPIRED");
  assert.deepEqual(fixture.rows.map(row => row.status), ["FAILED", "SKIPPED"]);
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});

test("migrates the lease column and persists it when a PostgreSQL step is claimed", async () => {
  const migrationCalls = [];
  const migrationPool = {
    async query(sql) {
      migrationCalls.push(sql);
      return { rows: [] };
    }
  };
  const migrationRepository = new AfriAgentApprovalPostgresRepository({ pool: migrationPool });
  await migrationRepository.initialize();
  assert.ok(migrationCalls.some(sql => sql.includes("ADD COLUMN IF NOT EXISTS lease_expires_at BIGINT")));

  const fixture = recoveryFixture({ steps: [{ status: "PENDING" }] });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.claimExecutionGrantStep({
    grantId: "grant-1",
    stepNumber: 1,
    now: 20000,
    leaseExpiresAt: 50000,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze",
    writeAuditEvent: audit
  });

  assert.equal(result.status, "RUNNING");
  assert.equal(result.startedAt, 20000);
  assert.equal(result.leaseExpiresAt, 50000);
  const claim = fixture.calls.find(call => call.sql.includes("SET status = 'RUNNING'"));
  assert.match(claim.sql, /started_at = \$3, lease_expires_at = \$4/);
  assert.deepEqual(claim.values, ["grant-1", 1, 20000, 50000]);
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});
