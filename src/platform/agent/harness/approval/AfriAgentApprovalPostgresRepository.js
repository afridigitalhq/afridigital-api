const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS afri_agent_approvals (
    approval_id TEXT PRIMARY KEY,
    source_agent_id TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    plan_fingerprint CHAR(64) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CONSUMED')),
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    approved_by TEXT,
    approved_at BIGINT,
    rejected_by TEXT,
    rejected_at BIGINT,
    rejection_reason TEXT,
    consumed_at BIGINT,
    CHECK (expires_at > created_at)
  );

  CREATE INDEX IF NOT EXISTS idx_afri_agent_approvals_status_expiry
    ON afri_agent_approvals (status, expires_at);

  CREATE TABLE IF NOT EXISTS afri_agent_execution_grants (
    grant_id TEXT PRIMARY KEY,
    approval_id TEXT NOT NULL UNIQUE REFERENCES afri_agent_approvals(approval_id),
    source_agent_id TEXT NOT NULL,
    requester_id TEXT NOT NULL,
    plan_fingerprint CHAR(64) NOT NULL,
    objective TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'FAILED', 'EXPIRED')),
    CHECK (expires_at > created_at)
  );

  CREATE TABLE IF NOT EXISTS afri_agent_execution_grant_steps (
    grant_id TEXT NOT NULL REFERENCES afri_agent_execution_grants(grant_id),
    step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 12),
    target_agent_id TEXT NOT NULL,
    capability_id TEXT NOT NULL,
    task TEXT NOT NULL,
    depends_on JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'SKIPPED')),
    result_hash CHAR(64),
    completed_at BIGINT,
    PRIMARY KEY (grant_id, step_number)
  );

  CREATE TABLE IF NOT EXISTS afri_agent_execution_receipts (
    receipt_id TEXT PRIMARY KEY,
    grant_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    source_agent_id TEXT NOT NULL,
    target_agent_id TEXT NOT NULL,
    capability_id TEXT NOT NULL,
    objective_hash CHAR(64) NOT NULL,
    dependencies_hash CHAR(64) NOT NULL,
    dependency_results_hash CHAR(64) NOT NULL,
    envelope_hash CHAR(64) NOT NULL,
    issued_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    consumed_at BIGINT,
    FOREIGN KEY (grant_id, step_number)
      REFERENCES afri_agent_execution_grant_steps(grant_id, step_number),
    CHECK (expires_at > issued_at)
  );

  CREATE INDEX IF NOT EXISTS idx_afri_agent_execution_grants_expiry
    ON afri_agent_execution_grants (status, expires_at);

  CREATE INDEX IF NOT EXISTS idx_afri_agent_execution_receipts_expiry
    ON afri_agent_execution_receipts (expires_at, consumed_at);
`;

function mapRecord(row) {
  if (!row) return null;
  return {
    approvalId: row.approval_id,
    sourceAgentId: row.source_agent_id,
    requestedBy: row.requested_by,
    planFingerprint: row.plan_fingerprint,
    status: row.status,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    approvedBy: row.approved_by,
    approvedAt: row.approved_at === null ? null : Number(row.approved_at),
    rejectedBy: row.rejected_by,
    rejectedAt: row.rejected_at === null ? null : Number(row.rejected_at),
    rejectionReason: row.rejection_reason,
    consumedAt: row.consumed_at === null ? null : Number(row.consumed_at)
  };
}

export class AfriAgentApprovalPostgresRepository {
  constructor({ pool } = {}) {
    if (!pool || typeof pool.query !== "function") {
      throw new Error("AFRI_APPROVAL_POSTGRES_POOL_REQUIRED");
    }
    this.pool = pool;
    this.initialization = null;
  }

  async initialize() {
    if (this.initialization) return this.initialization;
    this.initialization = this.pool.query(CREATE_TABLE_SQL).then(() => true);
    try {
      return await this.initialization;
    } catch (error) {
      this.initialization = null;
      throw error;
    }
  }

  async create(record) {
    const result = await this.pool.query(
      `INSERT INTO afri_agent_approvals (
        approval_id, source_agent_id, requested_by, plan_fingerprint,
        status, created_at, expires_at, approved_by, approved_at,
        rejected_by, rejected_at, rejection_reason, consumed_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) RETURNING *`,
      [
        record.approvalId,
        record.sourceAgentId,
        record.requestedBy,
        record.planFingerprint,
        record.status,
        record.createdAt,
        record.expiresAt,
        record.approvedBy ?? null,
        record.approvedAt ?? null,
        record.rejectedBy ?? null,
        record.rejectedAt ?? null,
        record.rejectionReason ?? null,
        record.consumedAt ?? null
      ]
    );
    return mapRecord(result.rows[0]);
  }

  async get(approvalId) {
    const result = await this.pool.query(
      "SELECT * FROM afri_agent_approvals WHERE approval_id = $1",
      [approvalId]
    );
    return mapRecord(result.rows[0]);
  }

  async approvePending(approvalId, patch) {
    const result = await this.pool.query(
      `UPDATE afri_agent_approvals
       SET status = 'APPROVED', approved_by = $2, approved_at = $3
       WHERE approval_id = $1
         AND status = 'PENDING'
         AND expires_at > $3
       RETURNING *`,
      [approvalId, patch.approvedBy, patch.approvedAt]
    );
    return mapRecord(result.rows[0]);
  }

  async rejectPending(approvalId, patch) {
    const result = await this.pool.query(
      `UPDATE afri_agent_approvals
       SET status = 'REJECTED', rejected_by = $2, rejected_at = $3,
           rejection_reason = $4
       WHERE approval_id = $1
         AND status = 'PENDING'
         AND expires_at > $3
       RETURNING *`,
      [
        approvalId,
        patch.rejectedBy,
        patch.rejectedAt,
        patch.rejectionReason ?? null
      ]
    );
    return mapRecord(result.rows[0]);
  }

  async consumeApproved({ approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt }) {
    const result = await this.pool.query(
      `UPDATE afri_agent_approvals
       SET status = 'CONSUMED', consumed_at = $5
       WHERE approval_id = $1
         AND source_agent_id = $2
         AND plan_fingerprint = $3
         AND requested_by = $4
         AND status = 'APPROVED'
         AND expires_at > $5
         AND consumed_at IS NULL
       RETURNING *`,
      [approvalId, sourceAgentId, planFingerprint, requesterId, consumedAt]
    );
    return mapRecord(result.rows[0]);
  }
}

export default AfriAgentApprovalPostgresRepository;
