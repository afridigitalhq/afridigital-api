import test from "node:test";
import assert from "node:assert/strict";
import { AfriAgentApprovalPostgresRepository } from "../AfriAgentApprovalPostgresRepository.js";

function createPool() {
  const calls = [];
  const pool = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      return { rows: [] };
    }
  };
  return { pool, calls };
}

const row = {
  approval_id: "approval-1",
  source_agent_id: "AGENT-AFRIAICOMMAND-001",
  requested_by: "USER-1",
  plan_fingerprint: "a".repeat(64),
  status: "APPROVED",
  created_at: "10000",
  expires_at: "20000",
  approved_by: "ADMIN-1",
  approved_at: "11000",
  rejected_by: null,
  rejected_at: null,
  rejection_reason: null,
  consumed_at: null
};

test("requires an injected PostgreSQL pool", () => {
  assert.throws(
    () => new AfriAgentApprovalPostgresRepository(),
    { message: "AFRI_APPROVAL_POSTGRES_POOL_REQUIRED" }
  );
});

test("initializes the approval table and expiry index once", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  await repository.initialize();
  await repository.initialize();

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /CREATE TABLE IF NOT EXISTS afri_agent_approvals/);
  assert.match(calls[0].sql, /CREATE INDEX IF NOT EXISTS idx_afri_agent_approvals_status_expiry/);
  assert.ok(calls[0].sql.includes("status TEXT NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED'))"));
  assert.ok(calls[0].sql.includes("ADD COLUMN IF NOT EXISTS started_at BIGINT"));
  assert.ok(calls[0].sql.includes("DO $$ BEGIN"));
  assert.ok(calls[0].sql.includes("pg_constraint"));
  assert.ok(calls[0].sql.includes("DROP CONSTRAINT afri_agent_execution_grant_steps_status_check"));
  assert.ok(calls[0].sql.includes("ADD CONSTRAINT afri_agent_execution_grant_steps_status_check CHECK"));
});

test("resets initialization after a database error so it can be retried", async () => {
  let attempts = 0;
  const pool = {
    async query() {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary database failure");
      return { rows: [] };
    }
  };
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  await assert.rejects(repository.initialize(), /temporary database failure/);
  assert.equal(await repository.initialize(), true);
  assert.equal(attempts, 2);
});

test("creates records and maps PostgreSQL BIGINT values to numbers", async () => {
  const { calls, pool } = createPool();
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values });
    return { rows: [row] };
  };
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  const record = await repository.create({
    approvalId: "approval-1",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requestedBy: "USER-1",
    planFingerprint: "a".repeat(64),
    status: "PENDING",
    createdAt: 10000,
    expiresAt: 20000
  });

  assert.match(calls[0].sql, /INSERT INTO afri_agent_approvals/);
  assert.equal(record.approvalId, "approval-1");
  assert.equal(record.createdAt, 10000);
  assert.equal(record.approvedAt, 11000);
  assert.equal(record.status, "APPROVED");
});

test("reads an approval by its identifier", async () => {
  const { pool, calls } = createPool();
  pool.query = async (sql, values) => {
    calls.push({ sql, values });
    return { rows: [row] };
  };
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  const record = await repository.get("approval-1");

  assert.match(calls[0].sql, /WHERE approval_id = \$1/);
  assert.deepEqual(calls[0].values, ["approval-1"]);
  assert.equal(record.sourceAgentId, "AGENT-AFRIAICOMMAND-001");
});

test("approval and rejection are conditional atomic pending-state transitions", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  await repository.approvePending("approval-1", {
    approvedBy: "ADMIN-1",
    approvedAt: 11000
  });
  await repository.rejectPending("approval-2", {
    rejectedBy: "ADMIN-2",
    rejectedAt: 12000,
    rejectionReason: "Not authorized"
  });

  assert.match(calls[0].sql, /status = 'PENDING'/);
  assert.match(calls[0].sql, /expires_at > \$3/);
  assert.match(calls[1].sql, /status = 'PENDING'/);
  assert.match(calls[1].sql, /rejection_reason = \$4/);
});

test("consumption is a single conditional update bound to source, fingerprint, status and expiry", async () => {
  const { pool, calls } = createPool();
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values });
    return { rows: [{ ...row, status: "CONSUMED", consumed_at: "13000" }] };
  };
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  const consumed = await repository.consumeApproved({
    approvalId: "approval-1",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requesterId: "USER-1",
    planFingerprint: "a".repeat(64),
    consumedAt: 13000
  });

  assert.match(calls[0].sql, /status = 'APPROVED'/);
  assert.match(calls[0].sql, /source_agent_id = \$2/);
  assert.match(calls[0].sql, /plan_fingerprint = \$3/);
  assert.ok(calls[0].sql.includes("requested_by = $4"));
  assert.ok(calls[0].sql.includes("expires_at > $5"));
  assert.match(calls[0].sql, /consumed_at IS NULL/);
  assert.equal(consumed.status, "CONSUMED");
  assert.equal(consumed.consumedAt, 13000);
  assert.deepEqual(calls[0].values, [
    "approval-1",
    "AGENT-AFRIAICOMMAND-001",
    "a".repeat(64),
    "USER-1",
    13000
  ]);
});

test("returns null when a conditional transition affects no record", async () => {
  const { pool } = createPool();
  const repository = new AfriAgentApprovalPostgresRepository({ pool });

  assert.equal(await repository.approvePending("missing", {
    approvedBy: "ADMIN-1",
    approvedAt: 11000
  }), null);
  assert.equal(await repository.rejectPending("missing", {
    rejectedBy: "ADMIN-1",
    rejectedAt: 11000
  }), null);
  assert.equal(await repository.consumeApproved({
    approvalId: "missing",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    planFingerprint: "a".repeat(64),
    consumedAt: 12000
  }), null);
});


// EXECUTION_GRANT_TRANSACTION_ATOMICITY_TESTS
function createGrantTransactionFixture({ missingApproval = false, failAt = null } = {}) {
  const calls = [];
  let released = false;
  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (failAt === 'grant' && sql.includes('INSERT INTO afri_agent_execution_grants')) throw new Error('grant insert failed');
      if (failAt === 'step' && sql.includes('INSERT INTO afri_agent_execution_grant_steps')) throw new Error('step insert failed');
      if (sql.includes('UPDATE afri_agent_approvals')) {
        return { rows: missingApproval ? [] : [{ ...row, status: 'CONSUMED', consumed_at: '13000' }] };
      }
      return { rows: [] };
    },
    release() { released = true; }
  };
  const pool = {
    async query() { throw new Error('transaction must not use pool.query'); },
    async connect() { return client; }
  };
  return { pool, client, calls, isReleased: () => released };
}

const grantFixture = {
  grantId: 'grant-1',
  approvalId: 'approval-1',
  sourceAgentId: 'AGENT-AFRIAICOMMAND-001',
  requesterId: 'USER-1',
  planFingerprint: 'a'.repeat(64),
  objective: 'Complete approved objective',
  summary: 'Two delegated steps',
  createdAt: 13000,
  expiresAt: 1030000,
  status: 'ACTIVE'
};

const grantStepsFixture = [
  { stepNumber: 1, targetAgentId: 'AGENT-AFRIDEBUG-001', capabilityId: 'debug.analyze', task: 'Inspect', dependsOn: [], status: 'PENDING' },
  { stepNumber: 2, targetAgentId: 'AGENT-AFRIREA-001', capabilityId: 'research.analyze', task: 'Research', dependsOn: [1], status: 'PENDING' }
];

const grantRequestFixture = writeAuditEvent => ({
  approvalId: 'approval-1',
  sourceAgentId: 'AGENT-AFRIAICOMMAND-001',
  requesterId: 'USER-1',
  planFingerprint: 'a'.repeat(64),
  consumedAt: 13000,
  grant: grantFixture,
  steps: grantStepsFixture,
  writeAuditEvent
});

test('creates an execution grant atomically and writes audit through the same transaction client', async () => {
  const fixture = createGrantTransactionFixture();
  let auditClient;
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  const result = await repository.consumeApprovedAndCreateExecutionGrant(
    grantRequestFixture(async client => {
      auditClient = client;
      await client.query('INSERT INTO afri_identity_audit_events (event_id) VALUES ($1)', ['EVENT-GRANT-1']);
    })
  );

  assert.ok(result);
  assert.equal(result.approval.status, 'CONSUMED');
  assert.equal(result.grant.grantId, 'grant-1');
  assert.equal(result.steps.length, 2);
  assert.equal(auditClient, fixture.client);
  assert.deepEqual(fixture.calls.map(call => {
    const sql = call.sql.trim();
    if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') return sql;
    if (sql.includes('UPDATE afri_agent_approvals')) return 'CONSUME_APPROVAL';
    if (sql.includes('INSERT INTO afri_agent_execution_grants')) return 'INSERT_GRANT';
    if (sql.includes('INSERT INTO afri_agent_execution_grant_steps')) return 'INSERT_STEP';
    if (sql.includes('INSERT INTO afri_identity_audit_events')) return 'INSERT_AUDIT';
    return 'OTHER';
  }), ['BEGIN', 'CONSUME_APPROVAL', 'INSERT_GRANT', 'INSERT_STEP', 'INSERT_STEP', 'INSERT_AUDIT', 'COMMIT']);
  assert.equal(fixture.isReleased(), true);
});

test('rolls back and skips grant and audit writes when approval consumption finds no row', async () => {
  const fixture = createGrantTransactionFixture({ missingApproval: true });
  let auditCalled = false;
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  const result = await repository.consumeApprovedAndCreateExecutionGrant(
    grantRequestFixture(async () => { auditCalled = true; })
  );

  assert.equal(result, null);
  assert.equal(auditCalled, false);
  assert.equal(fixture.calls.some(call => call.sql.includes('INSERT INTO')), false);
  assert.deepEqual(fixture.calls.map(call => call.sql.trim()), [
    'BEGIN',
    fixture.calls[1].sql.trim(),
    'ROLLBACK'
  ]);
  assert.equal(fixture.isReleased(), true);
});

test('rolls back and releases the client when grant insertion fails', async () => {
  const fixture = createGrantTransactionFixture({ failAt: 'grant' });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  await assert.rejects(
    repository.consumeApprovedAndCreateExecutionGrant(grantRequestFixture(async () => {})),
    /grant insert failed/
  );

  assert.ok(fixture.calls.some(call => call.sql.trim() === 'ROLLBACK'));
  assert.equal(fixture.calls.some(call => call.sql.trim() === 'COMMIT'), false);
  assert.equal(fixture.isReleased(), true);
});

test('rolls back and releases the client when a grant step insertion fails', async () => {
  const fixture = createGrantTransactionFixture({ failAt: 'step' });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  await assert.rejects(
    repository.consumeApprovedAndCreateExecutionGrant(grantRequestFixture(async () => {})),
    /step insert failed/
  );

  assert.ok(fixture.calls.some(call => call.sql.trim() === 'ROLLBACK'));
  assert.equal(fixture.calls.some(call => call.sql.trim() === 'COMMIT'), false);
  assert.equal(fixture.isReleased(), true);
});

test('rolls back grant and approval changes when audit writing fails', async () => {
  const fixture = createGrantTransactionFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  await assert.rejects(
    repository.consumeApprovedAndCreateExecutionGrant(
      grantRequestFixture(async client => {
        assert.equal(client, fixture.client);
        throw new Error('audit write failed');
      })
    ),
    /audit write failed/
  );

  assert.ok(fixture.calls.some(call => call.sql.includes('INSERT INTO afri_agent_execution_grants')));
  assert.ok(fixture.calls.some(call => call.sql.trim() === 'ROLLBACK'));
  assert.equal(fixture.calls.some(call => call.sql.trim() === 'COMMIT'), false);
  assert.equal(fixture.isReleased(), true);
});


// POSTGRES_GRANT_STEP_LIFECYCLE_TESTS
function createLifecycleFixture({ grant = {}, step = {}, dependencies = 0, remaining = 0, total = 1, completed = 0, failAudit = false } = {}) {
  const calls = [];
  let released = false;
  const grantRow = {
    grant_id: "grant-1",
    status: "ACTIVE",
    expires_at: "50000",
    ...grant
  };
  const stepRow = {
    grant_id: "grant-1",
    step_number: 1,
    target_agent_id: "AGENT-AFRIDEBUG-001",
    capability_id: "debug.analyze",
    task: "Inspect",
    depends_on: [],
    status: "PENDING",
    started_at: null,
    lease_expires_at: null,
    completed_at: null,
    result_hash: null,
    ...step
  };
  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") return { rows: [] };
      if (sql.includes("SELECT * FROM afri_agent_execution_grants")) return { rows: [grantRow] };
      if (sql.includes("SELECT * FROM afri_agent_execution_grant_steps")) return { rows: [stepRow] };
      if (sql.includes("SELECT COUNT(*)::int AS incomplete")) return { rows: [{ incomplete: dependencies }] };
      if (sql.includes("SET status = 'RUNNING'")) return { rows: [{ ...stepRow, status: "RUNNING", started_at: values[2], lease_expires_at: values[3] }] };
      if (sql.includes("SET status = 'EXPIRED'")) return { rows: [] };
      if (sql.includes("SET status = 'SKIPPED'")) return { rows: [{ ...stepRow, status: 'SKIPPED', completed_at: values[2] }] };
      if (sql.includes("SET status = $3")) return { rows: [{ ...stepRow, status: values[2], result_hash: values[3], completed_at: values[4] }] };
      if (sql.includes("AS remaining")) return { rows: [{ remaining }] };
      if (sql.includes("AS total")) return { rows: [{ total, completed }] };
      if (sql.includes("SET status = $2")) return { rows: [] };
      throw new Error("UNEXPECTED_LIFECYCLE_SQL: " + sql);
    },
    release() { released = true; }
  };
  const pool = {
    async query() { throw new Error("lifecycle must use transaction client"); },
    async connect() { return client; }
  };
  return { pool, calls, client, isReleased: () => released, grantRow, stepRow, failAudit };
}

const lifecycleAudit = async (client, event) => {
  assert.ok(client);
  assert.match(event.eventType, /^AGENT_EXECUTION_/);
};

test("claims a PostgreSQL grant step under row locks and commits its audit event", async () => {
  const fixture = createLifecycleFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.claimExecutionGrantStep({
    grantId: "grant-1",
    stepNumber: 1,
    now: 20000,
    leaseExpiresAt: 50000,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze",
    writeAuditEvent: lifecycleAudit
  });
  assert.equal(result.status, "RUNNING");
  assert.equal(result.startedAt, 20000);
  assert.equal(result.leaseExpiresAt, 50000);
  assert.deepEqual(fixture.calls.map(call => call.sql.trim().replace(/\s+/g, " ")), [
    "BEGIN",
    "SELECT * FROM afri_agent_execution_grants WHERE grant_id = $1 FOR UPDATE",
    "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number = $2 FOR UPDATE",
    "SELECT COUNT(*)::int AS incomplete FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number IN ( SELECT jsonb_array_elements_text(depends_on)::int FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number = $2 ) AND status <> 'COMPLETED'",
    "UPDATE afri_agent_execution_grant_steps SET status = 'RUNNING', started_at = $3, lease_expires_at = $4 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
    "COMMIT"
  ]);
  assert.equal(fixture.isReleased(), true);
});

test("expires an active PostgreSQL grant before allowing a step claim", async () => {
  const fixture = createLifecycleFixture({ grant: { expires_at: "19999" } });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.claimExecutionGrantStep({
    grantId: "grant-1",
    stepNumber: 1,
    now: 20000,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze",
    writeAuditEvent: lifecycleAudit
  });
  assert.equal(result, null);
  assert.ok(fixture.calls.some(call => call.sql.includes("SET status = 'EXPIRED'")));
  assert.ok(fixture.calls.some(call => call.sql.includes("SET status = 'SKIPPED'")));
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});

test("rolls back a PostgreSQL claim when its audit write fails", async () => {
  const fixture = createLifecycleFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  await assert.rejects(repository.claimExecutionGrantStep({
    grantId: "grant-1",
    stepNumber: 1,
    now: 20000,
    targetAgentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze",
    writeAuditEvent: async () => { throw new Error("audit persistence failed"); }
  }), /audit persistence failed/);
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
  assert.equal(fixture.calls.some(call => call.sql === "COMMIT"), false);
  assert.equal(fixture.isReleased(), true);
});

test("completes a PostgreSQL step with its result hash and finalizes the grant", async () => {
  const fixture = createLifecycleFixture({
    step: { status: "RUNNING", started_at: "19000", lease_expires_at: "50000" },
    remaining: 0,
    total: 1,
    completed: 1
  });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.completeExecutionGrantStep({
    grantId: "grant-1",
    stepNumber: 1,
    resultHash: "b".repeat(64),
    now: 21000,
    writeAuditEvent: lifecycleAudit
  });
  assert.equal(result.status, "COMPLETED");
  assert.equal(result.resultHash, "b".repeat(64));
  assert.ok(fixture.calls.some(call => call.sql.includes("SET status = $2") && call.values[1] === "COMPLETED"));
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});


// POSTGRES_EXPIRY_PARITY_REGRESSION_TESTS
function createExpiryLifecycleFixture({ twoRunning = false } = {}) {
  const calls = [];
  let released = false;
  let snapshot = null;
  const grant = { grant_id: 'grant-1', status: 'ACTIVE', expires_at: '19999' };
  const steps = [
    { grant_id: 'grant-1', step_number: 1, target_agent_id: 'AGENT-AFRIDEBUG-001', capability_id: 'debug.analyze', task: 'Running task 1', depends_on: [], status: 'RUNNING', started_at: '19000', lease_expires_at: '50000', completed_at: null, result_hash: null },
    ...(twoRunning ? [{ grant_id: 'grant-1', step_number: 2, target_agent_id: 'AGENT-AFRIDEBUG-001', capability_id: 'debug.analyze', task: 'Running task 2', depends_on: [], status: 'RUNNING', started_at: '19000', lease_expires_at: '50000', completed_at: null, result_hash: null }] : []),
    { grant_id: 'grant-1', step_number: twoRunning ? 3 : 2, target_agent_id: 'AGENT-AFRIDEBUG-001', capability_id: 'debug.analyze', task: 'Pending task', depends_on: [], status: 'PENDING', started_at: null, completed_at: null, result_hash: null }
  ];
  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (sql === 'BEGIN') { snapshot = { grant: { ...grant }, steps: steps.map(x => ({ ...x })) }; return { rows: [] }; }
      if (sql === 'ROLLBACK') { Object.assign(grant, snapshot.grant); steps.splice(0, steps.length, ...snapshot.steps.map(x => ({ ...x }))); return { rows: [] }; }
      if (sql === 'COMMIT') return { rows: [] };
      if (sql.includes('SELECT * FROM afri_agent_execution_grants')) return { rows: [{ ...grant }] };
      if (sql.includes('SELECT * FROM afri_agent_execution_grant_steps') && sql.includes("status = 'PENDING'")) return { rows: steps.filter(x => x.status === 'PENDING').map(x => ({ ...x })) };
      if (sql.includes('SELECT * FROM afri_agent_execution_grant_steps') && sql.includes('ORDER BY step_number FOR UPDATE')) return { rows: steps.map(x => ({ ...x })) };
      if (sql.includes('SELECT * FROM afri_agent_execution_grant_steps')) { const x = steps.find(y => y.step_number === values[1]); return { rows: x ? [{ ...x }] : [] }; }
      if (sql.includes("SET status = 'SKIPPED'")) { const x = steps.find(y => y.step_number === values[1] && y.status === 'PENDING'); if (!x) return { rows: [] }; Object.assign(x, { status: 'SKIPPED', result_hash: null, completed_at: values[2] }); return { rows: [{ ...x }] }; }
      if (sql.includes('SET status = $3')) { const x = steps.find(y => y.step_number === values[1]); if (!x) return { rows: [] }; Object.assign(x, { status: values[2], result_hash: values[3], completed_at: values[4] }); return { rows: [{ ...x }] }; }
      if (sql.includes('AS running')) return { rows: [{ running: steps.filter(x => x.status === 'RUNNING').length }] };
      if (sql.includes("SET status = 'EXPIRED'")) { grant.status = 'EXPIRED'; return { rows: [] }; }
      throw new Error('UNEXPECTED_EXPIRY_FIXTURE_SQL: ' + sql);
    },
    release() { released = true; }
  };
  return { pool: { async query() { throw new Error('transaction client required'); }, async connect() { return client; } }, calls, grant, steps, isReleased: () => released };
}

test('preserves running PostgreSQL work after expiry and expires only after it settles', async () => {
  const fixture = createExpiryLifecycleFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const claim = await repository.claimExecutionGrantStep({ grantId: 'grant-1', stepNumber: 2, now: 20000, targetAgentId: 'AGENT-AFRIDEBUG-001', capabilityId: 'debug.analyze', writeAuditEvent: lifecycleAudit });
  assert.equal(claim, null);
  assert.equal(fixture.grant.status, 'ACTIVE');
  assert.deepEqual(fixture.steps.map(x => x.status), ['RUNNING', 'SKIPPED']);
  const completed = await repository.completeExecutionGrantStep({ grantId: 'grant-1', stepNumber: 1, resultHash: 'b'.repeat(64), now: 21000, writeAuditEvent: lifecycleAudit });
  assert.equal(completed.status, 'COMPLETED');
  assert.deepEqual(fixture.steps.map(x => x.status), ['COMPLETED', 'SKIPPED']);
  assert.equal(fixture.grant.status, 'EXPIRED');
  assert.ok(fixture.calls.some(x => x.sql.includes('AS running')));
  assert.equal(fixture.calls.at(-1).sql, 'COMMIT');
  assert.equal(fixture.isReleased(), true);
});

test('keeps an expired PostgreSQL grant active until every running step settles', async () => {
  const fixture = createExpiryLifecycleFixture({ twoRunning: true });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });

  assert.equal(await repository.claimExecutionGrantStep({
    grantId: 'grant-1', stepNumber: 3, now: 20000,
    targetAgentId: 'AGENT-AFRIDEBUG-001', capabilityId: 'debug.analyze',
    writeAuditEvent: lifecycleAudit
  }), null);
  assert.equal(fixture.grant.status, 'ACTIVE');
  assert.deepEqual(fixture.steps.map(x => x.status), ['RUNNING', 'RUNNING', 'SKIPPED']);

  await repository.completeExecutionGrantStep({
    grantId: 'grant-1', stepNumber: 1, resultHash: 'd'.repeat(64), now: 21000,
    writeAuditEvent: lifecycleAudit
  });
  assert.equal(fixture.grant.status, 'ACTIVE');
  assert.deepEqual(fixture.steps.map(x => x.status), ['COMPLETED', 'RUNNING', 'SKIPPED']);

  await repository.completeExecutionGrantStep({
    grantId: 'grant-1', stepNumber: 2, resultHash: 'e'.repeat(64), now: 22000,
    writeAuditEvent: lifecycleAudit
  });
  assert.equal(fixture.grant.status, 'EXPIRED');
  assert.deepEqual(fixture.steps.map(x => x.status), ['COMPLETED', 'COMPLETED', 'SKIPPED']);
  assert.equal(fixture.calls.at(-1).sql, 'COMMIT');
  assert.equal(fixture.isReleased(), true);
});

test('rolls back PostgreSQL post-expiry completion when pending-step audit fails', async () => {
  const fixture = createExpiryLifecycleFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  await assert.rejects(repository.completeExecutionGrantStep({ grantId: 'grant-1', stepNumber: 1, resultHash: 'c'.repeat(64), now: 21000, writeAuditEvent: async (_client, event) => { if (event.eventType === 'AGENT_EXECUTION_STEP_SKIPPED') throw new Error('skip audit failed'); } }), /skip audit failed/);
  assert.equal(fixture.calls.at(-1).sql, 'ROLLBACK');
  assert.equal(fixture.calls.some(x => x.sql === 'COMMIT'), false);
  assert.equal(fixture.grant.status, 'ACTIVE');
  assert.deepEqual(fixture.steps.map(x => x.status), ['RUNNING', 'PENDING']);
  assert.equal(fixture.isReleased(), true);
});

// POSTGRES_RECEIPT_SECURITY_TESTS
function createReceiptFixture({
  failAudit = false,
  receiptConsumed,
  stepLeaseExpiresAt = "45000",
  receiptExpiresAt = "40000"
} = {}) {
  const calls = [];
  let released = false;
  const grantRow = {
    grant_id: "grant-1",
    source_agent_id: "AGENT-AFRIAICOMMAND-001",
    objective: "Approved objective",
    summary: "Approved summary",
    status: "ACTIVE",
    expires_at: "50000"
  };
  const stepRow = {
    grant_id: "grant-1",
    step_number: 1,
    target_agent_id: "AGENT-AFRIDEBUG-001",
    capability_id: "debug.analyze",
    task: "Inspect approved target",
    depends_on: [],
    status: "RUNNING",
    lease_expires_at: stepLeaseExpiresAt
  };
  let receiptRow = receiptConsumed === undefined ? null : {
    receipt_id: "receipt-digest",
    grant_id: "grant-1",
    step_number: 1,
    source_agent_id: "AGENT-AFRIAICOMMAND-001",
    target_agent_id: "AGENT-AFRIDEBUG-001",
    capability_id: "debug.analyze",
    objective_hash: "a".repeat(64),
    dependencies_hash: "b".repeat(64),
    dependency_results_hash: "c".repeat(64),
    envelope_hash: "d".repeat(64),
    expires_at: String(receiptExpiresAt),
    consumed_at: receiptConsumed
  };

  const client = {
    async query(sql, values = []) {
      calls.push({ sql, values });
      if (["BEGIN", "COMMIT", "ROLLBACK"].includes(sql)) return { rows: [] };
      if (sql.includes("SELECT * FROM afri_agent_execution_grants")) return { rows: [grantRow] };
      if (sql.includes("SELECT * FROM afri_agent_execution_grant_steps")) return { rows: [stepRow] };
      if (sql.includes("SELECT receipt_id FROM afri_agent_execution_receipts")) {
        return { rows: receiptRow ? [{ receipt_id: receiptRow.receipt_id }] : [] };
      }
      if (sql.includes("SELECT * FROM afri_agent_execution_receipts")) {
        return { rows: receiptRow ? [receiptRow] : [] };
      }
      if (sql.includes("INSERT INTO afri_agent_execution_receipts")) {
        receiptRow = {
          receipt_id: values[0],
          grant_id: values[1],
          step_number: values[2],
          source_agent_id: values[3],
          target_agent_id: values[4],
          capability_id: values[5],
          objective_hash: values[6],
          dependencies_hash: values[7],
          dependency_results_hash: values[8],
          envelope_hash: values[9],
          expires_at: String(values[11]),
          consumed_at: null
        };
        return { rows: [{ receipt_id: values[0] }] };
      }
      if (sql.includes("UPDATE afri_agent_execution_receipts SET consumed_at")) {
        if (!receiptRow || receiptRow.consumed_at !== null) return { rows: [] };
        receiptRow.consumed_at = values[1];
        return { rows: [{ receipt_id: receiptRow.receipt_id }] };
      }
      throw new Error("UNEXPECTED_RECEIPT_SQL: " + sql);
    },
    release() { released = true; }
  };
  return {
    pool: {
      async query() { throw new Error("receipt operation must use transaction client"); },
      async connect() { return client; }
    },
    calls,
    grantRow,
    stepRow,
    get receiptRow() { return receiptRow; },
    isReleased: () => released
  };
}

const receiptInput = {
  receiptId: "receipt-digest",
  grantId: "grant-1",
  stepNumber: 1,
  sourceAgentId: "AGENT-AFRIAICOMMAND-001",
  targetAgentId: "AGENT-AFRIDEBUG-001",
  capabilityId: "debug.analyze",
  planObjective: "Approved objective",
  planSummary: "Approved summary",
  objective: "Inspect approved target",
  dependsOn: [],
  objectiveHash: "a".repeat(64),
  dependenciesHash: "b".repeat(64),
  dependencyResultsHash: "c".repeat(64),
  envelopeHash: "d".repeat(64),
  now: 20000,
  expiresAt: 30000
};

const receiptAudit = async (client, event) => {
  assert.ok(client);
  assert.match(event.eventType, /^AGENT_EXECUTION_RECEIPT_/);
};

test("issues a PostgreSQL receipt bound to persisted grant and step fields with transactional audit", async () => {
  const fixture = createReceiptFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.issueExecutionReceipt({
    ...receiptInput,
    writeAuditEvent: receiptAudit
  });
  assert.deepEqual(result, { grantId: "grant-1", stepNumber: 1, expiresAt: 30000 });
  assert.ok(fixture.calls.some(call => call.sql.includes("FOR UPDATE")));
  assert.ok(fixture.calls.some(call => call.sql.includes("INSERT INTO afri_agent_execution_receipts")));
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});

test("rejects a receipt when its approved objective or step task differs from persisted state", async () => {
  const fixture = createReceiptFixture();
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.issueExecutionReceipt({
    ...receiptInput,
    objective: "Tampered task",
    writeAuditEvent: receiptAudit
  });
  assert.equal(result, null);
  assert.equal(fixture.calls.some(call => call.sql.includes("INSERT INTO afri_agent_execution_receipts")), false);
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
});

test("rejects duplicate receipt issuance for the same grant step", async () => {
  const fixture = createReceiptFixture({ receiptConsumed: null });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.issueExecutionReceipt({
    ...receiptInput,
    writeAuditEvent: receiptAudit
  });
  assert.equal(result, null);
  assert.equal(fixture.calls.some(call => call.sql.includes("INSERT INTO afri_agent_execution_receipts")), false);
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
});

test("consumes a PostgreSQL receipt once and audits inside the transaction", async () => {
  const fixture = createReceiptFixture({ receiptConsumed: null });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.consumeExecutionReceipt({
    ...receiptInput,
    receiptId: "receipt-digest",
    writeAuditEvent: receiptAudit
  });
  assert.equal(result.verified, true);
  assert.ok(fixture.calls.some(call => call.sql.includes("UPDATE afri_agent_execution_receipts SET consumed_at")));
  assert.equal(fixture.calls.at(-1).sql, "COMMIT");
  assert.equal(fixture.isReleased(), true);
});

test("rolls back receipt consumption when audit persistence fails", async () => {
  const fixture = createReceiptFixture({ receiptConsumed: null });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  await assert.rejects(
    repository.consumeExecutionReceipt({
      ...receiptInput,
      receiptId: "receipt-digest",
      writeAuditEvent: async () => { throw new Error("receipt audit failed"); }
    }),
    /receipt audit failed/
  );
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
  assert.equal(fixture.calls.some(call => call.sql === "COMMIT"), false);
  assert.equal(fixture.isReleased(), true);
});

test("rejects replay of an already consumed PostgreSQL receipt", async () => {
  const fixture = createReceiptFixture({ receiptConsumed: 25000 });
  const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
  const result = await repository.consumeExecutionReceipt({
    ...receiptInput,
    receiptId: "receipt-digest",
    writeAuditEvent: receiptAudit
  });
  assert.equal(result, null);
  assert.equal(fixture.calls.some(call => call.sql.includes("UPDATE afri_agent_execution_receipts SET consumed_at")), false);
  assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
});


test("rejects PostgreSQL completion when the execution lease is expired or invalid", async () => {
  for (const leaseExpiresAt of [null, "invalid", "21000"]) {
    const fixture = createLifecycleFixture({
      step: { status: "RUNNING", started_at: "19000", lease_expires_at: leaseExpiresAt }
    });
    const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
    const result = await repository.completeExecutionGrantStep({
      grantId: "grant-1",
      stepNumber: 1,
      resultHash: "f".repeat(64),
      now: 21000,
      writeAuditEvent: lifecycleAudit
    });
    assert.equal(result, null);
    assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
    assert.equal(fixture.isReleased(), true);
  }
});

test("rejects PostgreSQL receipt issuance for missing, expired, invalid, or insufficient leases", async () => {
  for (const stepLeaseExpiresAt of [null, "invalid", "20000", "25000"]) {
    const fixture = createReceiptFixture({ stepLeaseExpiresAt });
    const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
    const result = await repository.issueExecutionReceipt({
      ...receiptInput,
      writeAuditEvent: receiptAudit
    });
    assert.equal(result, null, `receipt issuance must reject lease ${String(stepLeaseExpiresAt)}`);
    assert.equal(fixture.calls.some(call => call.sql.includes("INSERT INTO afri_agent_execution_receipts")), false);
    assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
  }
});

test("rejects PostgreSQL receipt consumption when the lease is expired or receipt outlives the lease", async () => {
  for (const options of [
    { stepLeaseExpiresAt: "20000" },
    { stepLeaseExpiresAt: null },
    { stepLeaseExpiresAt: "45000", receiptExpiresAt: "46000" }
  ]) {
    const fixture = createReceiptFixture({ receiptConsumed: null, ...options });
    const repository = new AfriAgentApprovalPostgresRepository({ pool: fixture.pool });
    const result = await repository.consumeExecutionReceipt({
      ...receiptInput,
      receiptId: "receipt-digest",
      writeAuditEvent: receiptAudit
    });
    assert.equal(result, null);
    assert.equal(fixture.calls.some(call => call.sql.includes("UPDATE afri_agent_execution_receipts SET consumed_at")), false);
    assert.equal(fixture.calls.at(-1).sql, "ROLLBACK");
  }
});
