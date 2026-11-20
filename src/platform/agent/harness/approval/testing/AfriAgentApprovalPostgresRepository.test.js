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
