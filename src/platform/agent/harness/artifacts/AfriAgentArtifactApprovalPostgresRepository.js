const SCHEMA = `
CREATE TABLE IF NOT EXISTS afri_agent_artifact_approvals (
  approval_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  artifact_version INTEGER NOT NULL CHECK (artifact_version > 0),
  artifact_fingerprint CHAR(64) NOT NULL CHECK (artifact_fingerprint ~ '^[a-f0-9]{64}$'),
  source_agent_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED','CONSUMED')),
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
CREATE INDEX IF NOT EXISTS idx_afri_artifact_approvals_status_expiry
  ON afri_agent_artifact_approvals (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_afri_artifact_approvals_artifact
  ON afri_agent_artifact_approvals (artifact_id, artifact_version);

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_afri_artifact_approval_version' AND conrelid = 'afri_agent_artifact_approvals'::regclass) THEN
    ALTER TABLE afri_agent_artifact_approvals ADD CONSTRAINT fk_afri_artifact_approval_version
      FOREIGN KEY (artifact_id, artifact_version)
      REFERENCES afri_agent_artifact_versions (artifact_id, version) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'afri_artifact_approval_state_fields' AND conrelid = 'afri_agent_artifact_approvals'::regclass) THEN
    ALTER TABLE afri_agent_artifact_approvals ADD CONSTRAINT afri_artifact_approval_state_fields CHECK (
      (status = 'PENDING' AND approved_by IS NULL AND approved_at IS NULL AND rejected_by IS NULL AND rejected_at IS NULL AND rejection_reason IS NULL AND consumed_at IS NULL)
      OR (status = 'APPROVED' AND approved_by IS NOT NULL AND approved_at IS NOT NULL AND rejected_by IS NULL AND rejected_at IS NULL AND rejection_reason IS NULL AND consumed_at IS NULL)
      OR (status = 'REJECTED' AND approved_by IS NULL AND approved_at IS NULL AND rejected_by IS NOT NULL AND rejected_at IS NOT NULL AND (rejection_reason IS NULL OR length(rejection_reason) <= 500) AND consumed_at IS NULL)
      OR (status = 'CONSUMED' AND approved_by IS NOT NULL AND approved_at IS NOT NULL AND rejected_by IS NULL AND rejected_at IS NULL AND rejection_reason IS NULL AND consumed_at IS NOT NULL)
    );
  END IF;
END;
$migration$;
CREATE OR REPLACE FUNCTION afri_artifact_approval_transition_guard() RETURNS trigger AS $guard$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION USING MESSAGE = 'AFRI_ARTIFACT_APPROVAL_DELETE_FORBIDDEN';
  END IF;
  IF NEW.approval_id IS DISTINCT FROM OLD.approval_id OR NEW.artifact_id IS DISTINCT FROM OLD.artifact_id OR NEW.artifact_version IS DISTINCT FROM OLD.artifact_version OR NEW.artifact_fingerprint IS DISTINCT FROM OLD.artifact_fingerprint OR NEW.source_agent_id IS DISTINCT FROM OLD.source_agent_id OR NEW.requested_by IS DISTINCT FROM OLD.requested_by OR NEW.created_at IS DISTINCT FROM OLD.created_at OR NEW.expires_at IS DISTINCT FROM OLD.expires_at THEN
    RAISE EXCEPTION USING MESSAGE = 'AFRI_ARTIFACT_APPROVAL_IDENTITY_IMMUTABLE';
  END IF;
  IF OLD.status = 'PENDING' AND NEW.status = 'APPROVED' AND NEW.approved_by IS NOT NULL AND NEW.approved_at IS NOT NULL AND NEW.rejected_by IS NULL AND NEW.rejected_at IS NULL AND NEW.rejection_reason IS NULL AND NEW.consumed_at IS NULL THEN RETURN NEW; END IF;
  IF OLD.status = 'PENDING' AND NEW.status = 'REJECTED' AND NEW.rejected_by IS NOT NULL AND NEW.rejected_at IS NOT NULL AND (NEW.rejection_reason IS NULL OR length(NEW.rejection_reason) <= 500) AND NEW.approved_by IS NULL AND NEW.approved_at IS NULL AND NEW.consumed_at IS NULL THEN RETURN NEW; END IF;
  IF OLD.status = 'APPROVED' AND NEW.status = 'CONSUMED' AND NEW.approved_by IS NOT DISTINCT FROM OLD.approved_by AND NEW.approved_at IS NOT DISTINCT FROM OLD.approved_at AND NEW.rejected_by IS NULL AND NEW.rejected_at IS NULL AND NEW.rejection_reason IS NULL AND NEW.consumed_at IS NOT NULL THEN RETURN NEW; END IF;
  RAISE EXCEPTION USING MESSAGE = 'AFRI_ARTIFACT_APPROVAL_TRANSITION_FORBIDDEN';
END;
$guard$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_afri_artifact_approval_transition ON afri_agent_artifact_approvals;
CREATE TRIGGER trg_afri_artifact_approval_transition
  BEFORE UPDATE OR DELETE ON afri_agent_artifact_approvals
  FOR EACH ROW EXECUTE FUNCTION afri_artifact_approval_transition_guard();
`;

function mapRecord(row) {
  if (!row) return null;
  return Object.freeze({
    approvalId: row.approval_id,
    artifactId: row.artifact_id,
    artifactVersion: Number(row.artifact_version),
    artifactFingerprint: row.artifact_fingerprint.trim(),
    sourceAgentId: row.source_agent_id,
    requestedBy: row.requested_by,
    status: row.status,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    approvedBy: row.approved_by,
    approvedAt: row.approved_at === null ? null : Number(row.approved_at),
    rejectedBy: row.rejected_by,
    rejectedAt: row.rejected_at === null ? null : Number(row.rejected_at),
    rejectionReason: row.rejection_reason,
    consumedAt: row.consumed_at === null ? null : Number(row.consumed_at)
  });
}

export class AfriAgentArtifactApprovalPostgresRepository {
  constructor({ pool } = {}) {
    if (!pool || typeof pool.query !== "function") {
      throw new Error("AFRI_ARTIFACT_APPROVAL_POSTGRES_POOL_REQUIRED");
    }
    this.pool = pool;
    this.initialization = null;
  }

  async initialize() {
    if (!this.initialization) {
      this.initialization = this.pool.query(SCHEMA).then(() => true).catch(error => {
        this.initialization = null;
        throw error;
      });
    }
    return this.initialization;
  }

  async create(record) {
    const result = await this.pool.query(
      `INSERT INTO afri_agent_artifact_approvals
       (approval_id, artifact_id, artifact_version, artifact_fingerprint,
        source_agent_id, requested_by, status, created_at, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        record.approvalId, record.artifactId, record.artifactVersion,
        record.artifactFingerprint, record.sourceAgentId, record.requestedBy,
        record.status, record.createdAt, record.expiresAt
      ]
    );
    return mapRecord(result.rows?.[0]);
  }

  async get(approvalId) {
    const result = await this.pool.query(
      "SELECT * FROM afri_agent_artifact_approvals WHERE approval_id = $1",
      [approvalId]
    );
    return mapRecord(result.rows?.[0]);
  }

  async approvePending(approvalId, patch) {
    const result = await this.pool.query(
      `UPDATE afri_agent_artifact_approvals
       SET status='APPROVED', approved_by=$2, approved_at=$3
       WHERE approval_id=$1 AND status='PENDING' AND expires_at>$3
       RETURNING *`,
      [approvalId, patch.approvedBy, patch.approvedAt]
    );
    return mapRecord(result.rows?.[0]);
  }

  async rejectPending(approvalId, patch) {
    const result = await this.pool.query(
      `UPDATE afri_agent_artifact_approvals
       SET status='REJECTED', rejected_by=$2, rejected_at=$3, rejection_reason=$4
       WHERE approval_id=$1 AND status='PENDING' AND expires_at>$3
       RETURNING *`,
      [approvalId, patch.rejectedBy, patch.rejectedAt, patch.rejectionReason ?? null]
    );
    return mapRecord(result.rows?.[0]);
  }

  async consumeApproved({ approvalId, artifactId, artifactVersion, artifactFingerprint, sourceAgentId, requesterId, consumedAt }) {
    const result = await this.pool.query(
      `UPDATE afri_agent_artifact_approvals
       SET status='CONSUMED', consumed_at=$7
       WHERE approval_id=$1 AND artifact_id=$2 AND artifact_version=$3
         AND artifact_fingerprint=$4 AND source_agent_id=$5
         AND requested_by=$6 AND status='APPROVED'
         AND expires_at>$7 AND consumed_at IS NULL
       RETURNING *`,
      [approvalId, artifactId, artifactVersion, artifactFingerprint, sourceAgentId, requesterId, consumedAt]
    );
    return mapRecord(result.rows?.[0]);
  }
}

export default AfriAgentArtifactApprovalPostgresRepository;
