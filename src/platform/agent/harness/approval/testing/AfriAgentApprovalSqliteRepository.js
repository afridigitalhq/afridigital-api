import { DatabaseSync } from "node:sqlite";

/**
 * TEST ONLY.
 * SQLite-backed approval repository for realistic integration tests.
 * Never wire this repository into production bootstrap.
 */
export class AfriAgentApprovalSqliteRepository {
  constructor({ filename = ":memory:" } = {}) {
    if (typeof filename !== "string" || !filename.trim()) {
      throw new Error("AFRI_APPROVAL_SQLITE_FILENAME_REQUIRED");
    }

    this.db = new DatabaseSync(filename);
    this.db.exec("PRAGMA busy_timeout = 5000");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS afri_agent_approvals (
        approvalId TEXT PRIMARY KEY,
        sourceAgentId TEXT NOT NULL,
        requestedBy TEXT NOT NULL,
        planFingerprint TEXT NOT NULL,
        status TEXT NOT NULL CHECK (
          status IN ('PENDING', 'APPROVED', 'REJECTED', 'CONSUMED')
        ),
        createdAt INTEGER NOT NULL,
        expiresAt INTEGER NOT NULL,
        approvedBy TEXT,
        approvedAt INTEGER,
        rejectedBy TEXT,
        rejectedAt INTEGER,
        rejectionReason TEXT,
        consumedAt INTEGER
      )
    `);
  }

  _record(row) {
    if (!row) return null;

    return {
      approvalId: row.approvalId,
      sourceAgentId: row.sourceAgentId,
      requestedBy: row.requestedBy,
      planFingerprint: row.planFingerprint,
      status: row.status,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      approvedBy: row.approvedBy,
      approvedAt: row.approvedAt,
      rejectedBy: row.rejectedBy,
      rejectedAt: row.rejectedAt,
      ...(row.rejectionReason === null
        ? {}
        : { rejectionReason: row.rejectionReason }),
      consumedAt: row.consumedAt
    };
  }

  async create(record) {
    this.db.prepare(`
      INSERT INTO afri_agent_approvals (
        approvalId, sourceAgentId, requestedBy, planFingerprint,
        status, createdAt, expiresAt, approvedBy, approvedAt,
        rejectedBy, rejectedAt, rejectionReason, consumedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return this.get(record.approvalId);
  }

  async get(approvalId) {
    const row = this.db.prepare(`
      SELECT * FROM afri_agent_approvals WHERE approvalId = ?
    `).get(approvalId);

    return this._record(row);
  }

  async approvePending(approvalId, patch) {
    const row = this.db.prepare(`
      UPDATE afri_agent_approvals
      SET status = 'APPROVED', approvedBy = ?, approvedAt = ?
      WHERE approvalId = ? AND status = 'PENDING'
      RETURNING *
    `).get(patch.approvedBy, patch.approvedAt, approvalId);

    return this._record(row);
  }

  async rejectPending(approvalId, patch) {
    const row = this.db.prepare(`
      UPDATE afri_agent_approvals
      SET status = 'REJECTED',
          rejectedBy = ?,
          rejectedAt = ?,
          rejectionReason = ?
      WHERE approvalId = ? AND status = 'PENDING'
      RETURNING *
    `).get(
      patch.rejectedBy,
      patch.rejectedAt,
      patch.rejectionReason ?? null,
      approvalId
    );

    return this._record(row);
  }

  async consumeApproved({
    approvalId,
    sourceAgentId,
    requesterId,
    planFingerprint,
    consumedAt
  }) {
    // A single conditional UPDATE makes consumption an atomic,
    // one-time transition even when multiple connections compete.
    const row = this.db.prepare(`
      UPDATE afri_agent_approvals
      SET status = 'CONSUMED', consumedAt = ?
      WHERE approvalId = ?
        AND sourceAgentId = ?
        AND planFingerprint = ?
        AND requestedBy = ?
        AND status = 'APPROVED'
        AND expiresAt > ?
        AND consumedAt IS NULL
      RETURNING *
    `).get(
      consumedAt,
      approvalId,
      sourceAgentId,
      planFingerprint,
      requesterId,
      consumedAt
    );

    return this._record(row);
  }

  close() {
    if (!this.db) return;
    this.db.close();
    this.db = null;
  }
}

export default AfriAgentApprovalSqliteRepository;
