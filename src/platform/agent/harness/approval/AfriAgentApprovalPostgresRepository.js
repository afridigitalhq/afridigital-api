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
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED')),
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
  ALTER TABLE afri_agent_execution_grant_steps ADD COLUMN IF NOT EXISTS started_at BIGINT;
  ALTER TABLE afri_agent_execution_grant_steps ADD COLUMN IF NOT EXISTS lease_expires_at BIGINT;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'afri_agent_execution_grant_steps'::regclass AND conname = 'afri_agent_execution_grant_steps_status_check' AND pg_get_constraintdef(oid) NOT ILIKE '%RUNNING%') THEN
      ALTER TABLE afri_agent_execution_grant_steps DROP CONSTRAINT afri_agent_execution_grant_steps_status_check;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'afri_agent_execution_grant_steps'::regclass AND conname = 'afri_agent_execution_grant_steps_status_check') THEN
      ALTER TABLE afri_agent_execution_grant_steps ADD CONSTRAINT afri_agent_execution_grant_steps_status_check CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED'));
    END IF;
  END $$;

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

  async consumeApprovedAndCreateExecutionGrant({
    approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt,
    grant, steps, writeAuditEvent
  } = {}) {
    if (typeof this.pool.connect !== "function") {
      throw new Error("AFRI_APPROVAL_TRANSACTION_SUPPORT_REQUIRED");
    }
    if (!grant || !Array.isArray(steps) || typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_INPUT_INVALID");
    }

    const client = await this.pool.connect();
    let transactionOpen = false;
    try {
      await client.query("BEGIN");
      transactionOpen = true;

      const consumed = await client.query(
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

      if (!consumed.rows[0]) {
        await client.query("ROLLBACK");
        transactionOpen = false;
        return null;
      }

      await client.query(
        `INSERT INTO afri_agent_execution_grants (
          grant_id, approval_id, source_agent_id, requester_id,
          plan_fingerprint, objective, summary, created_at, expires_at, status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          grant.grantId, grant.approvalId, grant.sourceAgentId,
          grant.requesterId, grant.planFingerprint, grant.objective,
          grant.summary, grant.createdAt, grant.expiresAt, grant.status
        ]
      );

      for (const step of steps) {
        await client.query(
          `INSERT INTO afri_agent_execution_grant_steps (
            grant_id, step_number, target_agent_id, capability_id,
            task, depends_on, status
          ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7)`,
          [
            grant.grantId, step.stepNumber, step.targetAgentId,
            step.capabilityId, step.task, JSON.stringify(step.dependsOn),
            step.status
          ]
        );
      }

      await writeAuditEvent(client);
      await client.query("COMMIT");
      transactionOpen = false;

      return {
        approval: mapRecord(consumed.rows[0]),
        grant: { ...grant },
        steps: steps.map(step => ({ ...step, dependsOn: [...step.dependsOn] }))
      };
    } catch (error) {
      if (transactionOpen) {
        try { await client.query("ROLLBACK"); } catch {}
      }
      throw error;
    } finally {
      client.release();
    }
  }


  async issueExecutionReceipt({
    receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
    capabilityId, planObjective, planSummary, objective, dependsOn,
    objectiveHash, dependenciesHash, dependencyResultsHash, envelopeHash,
    now, expiresAt, writeAuditEvent
  } = {}) {
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_APPROVAL_TRANSACTION_SUPPORT_REQUIRED");
    if (typeof writeAuditEvent !== "function") throw new Error("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");

    const client = await this.pool.connect();
    let open = false;
    try {
      await client.query("BEGIN");
      open = true;

      const grantResult = await client.query(
        "SELECT * FROM afri_agent_execution_grants WHERE grant_id = $1 FOR UPDATE",
        [grantId]
      );
      const grant = grantResult.rows[0];

      const stepResult = await client.query(
        "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number = $2 FOR UPDATE",
        [grantId, stepNumber]
      );
      const step = stepResult.rows[0];

      const storedDependencies = step
        ? (typeof step.depends_on === "string" ? JSON.parse(step.depends_on) : step.depends_on)
        : null;
      const stepLeaseExpiresAt = step?.lease_expires_at === null || step?.lease_expires_at === undefined
        ? null
        : Number(step.lease_expires_at);

      if (
        !grant || grant.status !== "ACTIVE" || Number(grant.expires_at) <= now ||
        grant.source_agent_id !== sourceAgentId ||
        grant.objective !== planObjective || grant.summary !== planSummary ||
        !step || step.status !== "RUNNING" ||
        !Number.isSafeInteger(stepLeaseExpiresAt) || stepLeaseExpiresAt <= now ||
        step.target_agent_id !== targetAgentId || step.capability_id !== capabilityId ||
        step.task !== objective ||
        JSON.stringify(storedDependencies) !== JSON.stringify(dependsOn) ||
        expiresAt <= now || expiresAt > Number(grant.expires_at) || expiresAt > stepLeaseExpiresAt
      ) {
        await client.query("ROLLBACK");
        open = false;
        return null;
      }

      const existing = await client.query(
        "SELECT receipt_id FROM afri_agent_execution_receipts WHERE grant_id = $1 AND step_number = $2 FOR UPDATE",
        [grantId, stepNumber]
      );
      if (existing.rows[0]) {
        await client.query("ROLLBACK");
        open = false;
        return null;
      }

      const inserted = await client.query(
        `INSERT INTO afri_agent_execution_receipts (
          receipt_id, grant_id, step_number, source_agent_id, target_agent_id,
          capability_id, objective_hash, dependencies_hash, dependency_results_hash,
          envelope_hash, issued_at, expires_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING receipt_id`,
        [
          receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
          capabilityId, objectiveHash, dependenciesHash, dependencyResultsHash,
          envelopeHash, now, expiresAt
        ]
      );
      if (!inserted.rows[0]) throw new Error("AFRI_RECEIPT_ISSUANCE_FAILED");

      await writeAuditEvent(client, {
        eventType: "AGENT_EXECUTION_RECEIPT_ISSUED",
        outcome: "SUCCESS",
        details: { grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId }
      });

      await client.query("COMMIT");
      open = false;
      return Object.freeze({ grantId, stepNumber, expiresAt });
    } catch (error) {
      if (open) { try { await client.query("ROLLBACK"); } catch {} }
      throw error;
    } finally {
      client.release();
    }
  }

  async consumeExecutionReceipt({
    receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
    capabilityId, planObjective, planSummary, objective, dependsOn,
    objectiveHash, dependenciesHash, dependencyResultsHash, envelopeHash,
    now, writeAuditEvent
  } = {}) {
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_APPROVAL_TRANSACTION_SUPPORT_REQUIRED");
    if (typeof writeAuditEvent !== "function") throw new Error("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");

    const client = await this.pool.connect();
    let open = false;
    try {
      await client.query("BEGIN");
      open = true;

      // Keep lock ordering consistent with issuance: grant, step, then receipt.
      const grantResult = await client.query(
        "SELECT * FROM afri_agent_execution_grants WHERE grant_id = $1 FOR UPDATE",
        [grantId]
      );
      const grant = grantResult.rows[0];

      const stepResult = await client.query(
        "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number = $2 FOR UPDATE",
        [grantId, stepNumber]
      );
      const step = stepResult.rows[0];

      const storedDependencies = step
        ? (typeof step.depends_on === "string" ? JSON.parse(step.depends_on) : step.depends_on)
        : null;
      const stepLeaseExpiresAt = step?.lease_expires_at === null || step?.lease_expires_at === undefined
        ? null
        : Number(step.lease_expires_at);

      if (
        !grant || grant.status !== "ACTIVE" || Number(grant.expires_at) <= now ||
        grant.source_agent_id !== sourceAgentId ||
        grant.objective !== planObjective || grant.summary !== planSummary ||
        !step || step.status !== "RUNNING" ||
        !Number.isSafeInteger(stepLeaseExpiresAt) || stepLeaseExpiresAt <= now ||
        step.target_agent_id !== targetAgentId || step.capability_id !== capabilityId ||
        step.task !== objective ||
        JSON.stringify(storedDependencies) !== JSON.stringify(dependsOn)
      ) {
        await client.query("ROLLBACK");
        open = false;
        return null;
      }

      const receiptResult = await client.query(
        "SELECT * FROM afri_agent_execution_receipts WHERE receipt_id = $1 FOR UPDATE",
        [receiptId]
      );
      const receipt = receiptResult.rows[0];

      if (
        !receipt || receipt.consumed_at !== null || Number(receipt.expires_at) <= now ||
        Number(receipt.expires_at) > stepLeaseExpiresAt ||
        receipt.grant_id !== grantId || Number(receipt.step_number) !== stepNumber ||
        receipt.source_agent_id !== sourceAgentId ||
        receipt.target_agent_id !== targetAgentId ||
        receipt.capability_id !== capabilityId ||
        receipt.objective_hash.trim() !== objectiveHash ||
        receipt.dependencies_hash.trim() !== dependenciesHash ||
        receipt.dependency_results_hash.trim() !== dependencyResultsHash ||
        receipt.envelope_hash.trim() !== envelopeHash
      ) {
        await client.query("ROLLBACK");
        open = false;
        return null;
      }

      const consumed = await client.query(
        "UPDATE afri_agent_execution_receipts SET consumed_at = $2 WHERE receipt_id = $1 AND consumed_at IS NULL AND expires_at > $2 RETURNING receipt_id",
        [receiptId, now]
      );
      if (!consumed.rows[0]) {
        await client.query("ROLLBACK");
        open = false;
        return null;
      }

      await writeAuditEvent(client, {
        eventType: "AGENT_EXECUTION_RECEIPT_CONSUMED",
        outcome: "SUCCESS",
        details: { grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId }
      });

      await client.query("COMMIT");
      open = false;
      return Object.freeze({
        grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId,
        verified: true
      });
    } catch (error) {
      if (open) { try { await client.query("ROLLBACK"); } catch {} }
      throw error;
    } finally {
      client.release();
    }
  }

  async recoverExpiredExecutionGrantSteps({ now, writeAuditEvent } = {}) {
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_APPROVAL_TRANSACTION_SUPPORT_REQUIRED");
    if (!Number.isSafeInteger(now) || typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_RECOVERY_INPUT_INVALID");
    }

    const client = await this.pool.connect();
    let transactionOpen = false;
    let recovered = 0;
    let skipped = 0;
    let grantsFinalized = 0;

    const audit = (eventType, outcome, details) =>
      writeAuditEvent(client, { eventType, outcome, details });

    try {
      await client.query("BEGIN");
      transactionOpen = true;

      const grantsResult = await client.query(
        "SELECT * FROM afri_agent_execution_grants WHERE status = 'ACTIVE' ORDER BY grant_id FOR UPDATE"
      );

      for (const grant of grantsResult.rows ?? []) {
        const grantId = grant.grant_id;
        const stepsResult = await client.query(
          "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 ORDER BY step_number FOR UPDATE",
          [grantId]
        );
        const steps = stepsResult.rows ?? [];

        for (const step of steps) {
          const leaseExpiresAt = step.lease_expires_at === null ||
            step.lease_expires_at === undefined ? null : Number(step.lease_expires_at);
          if (step.status !== "RUNNING" ||
              (Number.isSafeInteger(leaseExpiresAt) && leaseExpiresAt > now)) continue;

          const updated = await client.query(
            "UPDATE afri_agent_execution_grant_steps SET status = 'FAILED', result_hash = NULL, completed_at = $3 WHERE grant_id = $1 AND step_number = $2 AND status = 'RUNNING' RETURNING *",
            [grantId, step.step_number, now]
          );
          if (!updated.rows[0]) continue;
          step.status = "FAILED";
          recovered++;
          await audit("AGENT_EXECUTION_STEP_FAILED", "FAILURE", {
            grantId,
            stepNumber: Number(step.step_number),
            errorCode: "EXECUTION_LEASE_EXPIRED"
          });
        }

        let changed = true;
        while (changed) {
          changed = false;
          for (const step of steps) {
            if (step.status !== "PENDING") continue;
            let dependencies = step.depends_on ?? [];
            if (typeof dependencies === "string") dependencies = JSON.parse(dependencies);
            const failedDependency = dependencies.some(number => {
              const dependency = steps.find(item => Number(item.step_number) === Number(number));
              return dependency && ["FAILED", "SKIPPED"].includes(dependency.status);
            });
            if (!failedDependency) continue;

            const updated = await client.query(
              "UPDATE afri_agent_execution_grant_steps SET status = 'SKIPPED', result_hash = NULL, completed_at = $3 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
              [grantId, step.step_number, now]
            );
            if (!updated.rows[0]) continue;
            step.status = "SKIPPED";
            skipped++;
            changed = true;
            await audit("AGENT_EXECUTION_STEP_SKIPPED", "FAILURE", {
              grantId,
              stepNumber: Number(step.step_number),
              errorCode: "DEPENDENCY_FAILED"
            });
          }
        }

        if (Number(grant.expires_at) <= now) {
          for (const step of steps) {
            if (step.status !== "PENDING") continue;
            const updated = await client.query(
              "UPDATE afri_agent_execution_grant_steps SET status = 'SKIPPED', result_hash = NULL, completed_at = $3 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
              [grantId, step.step_number, now]
            );
            if (!updated.rows[0]) continue;
            step.status = "SKIPPED";
            skipped++;
            await audit("AGENT_EXECUTION_STEP_SKIPPED", "FAILURE", {
              grantId,
              stepNumber: Number(step.step_number),
              errorCode: "GRANT_EXPIRED"
            });
          }

          if (!steps.some(step => step.status === "RUNNING")) {
            await client.query(
              "UPDATE afri_agent_execution_grants SET status = 'EXPIRED' WHERE grant_id = $1 AND status = 'ACTIVE'",
              [grantId]
            );
            grantsFinalized++;
            await audit("AGENT_EXECUTION_GRANT_EXPIRED", "SUCCESS", { grantId });
          }
          continue;
        }

        if (!steps.some(step => ["PENDING", "RUNNING"].includes(step.status))) {
          const allCompleted = steps.length > 0 && steps.every(step => step.status === "COMPLETED");
          const status = allCompleted ? "COMPLETED" : "FAILED";
          await client.query(
            "UPDATE afri_agent_execution_grants SET status = $2 WHERE grant_id = $1 AND status = 'ACTIVE'",
            [grantId, status]
          );
          grantsFinalized++;
          await audit(
            `AGENT_EXECUTION_GRANT_${status}`,
            allCompleted ? "SUCCESS" : "FAILURE",
            { grantId }
          );
        }
      }

      await client.query("COMMIT");
      transactionOpen = false;
      return { recovered, skipped, grantsFinalized };
    } catch (error) {
      if (transactionOpen) {
        try { await client.query("ROLLBACK"); } catch {}
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async claimExecutionGrantStep({ grantId, stepNumber, now, targetAgentId, capabilityId, leaseExpiresAt, writeAuditEvent } = {}) {
    return this._transitionExecutionGrantStep({ action: "CLAIM", grantId, stepNumber, now, targetAgentId, capabilityId, leaseExpiresAt, writeAuditEvent });
  }

  async completeExecutionGrantStep({ grantId, stepNumber, resultHash, now, writeAuditEvent } = {}) {
    return this._transitionExecutionGrantStep({ action: "COMPLETED", grantId, stepNumber, resultHash, now, writeAuditEvent });
  }

  async failExecutionGrantStep({ grantId, stepNumber, errorCode, now, writeAuditEvent } = {}) {
    return this._transitionExecutionGrantStep({ action: "FAILED", grantId, stepNumber, errorCode, now, writeAuditEvent });
  }

  async skipExecutionGrantStep({ grantId, stepNumber, errorCode, now, writeAuditEvent } = {}) {
    return this._transitionExecutionGrantStep({ action: "SKIPPED", grantId, stepNumber, errorCode, now, writeAuditEvent });
  }

  async _transitionExecutionGrantStep({ action, grantId, stepNumber, now, targetAgentId, capabilityId, leaseExpiresAt, resultHash, errorCode, writeAuditEvent } = {}) {
    if (typeof this.pool.connect !== "function") throw new Error("AFRI_APPROVAL_TRANSACTION_SUPPORT_REQUIRED");
    if (!["CLAIM", "COMPLETED", "FAILED", "SKIPPED"].includes(action) || typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_TRANSITION_INPUT_INVALID");
    }

    const client = await this.pool.connect();
    let transactionOpen = false;
    try {
      await client.query("BEGIN");
      transactionOpen = true;

      const grantResult = await client.query(
        "SELECT * FROM afri_agent_execution_grants WHERE grant_id = $1 FOR UPDATE",
        [grantId]
      );
      const grant = grantResult.rows[0];
      if (!grant || grant.status !== "ACTIVE") {
        await client.query("ROLLBACK");
        transactionOpen = false;
        return null;
      }

      if (action === "CLAIM" && Number(grant.expires_at) <= now) {
        const lockedSteps = await client.query(
          "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 ORDER BY step_number FOR UPDATE",
          [grantId]
        );
        const pendingSteps = (lockedSteps.rows ?? []).filter(item => item.status === "PENDING");
        const hasRunningSteps = (lockedSteps.rows ?? []).some(item => item.status === "RUNNING");

        for (const pending of pendingSteps) {
          const skipped = await client.query(
            "UPDATE afri_agent_execution_grant_steps SET status = 'SKIPPED', result_hash = NULL, completed_at = $3 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
            [grantId, pending.step_number, now]
          );
          if (skipped.rows[0]) {
            await writeAuditEvent(client, {
              eventType: "AGENT_EXECUTION_STEP_SKIPPED",
              outcome: "FAILURE",
              details: {
                grantId,
                stepNumber: Number(pending.step_number),
                errorCode: "GRANT_EXPIRED"
              }
            });
          }
        }

        if (!hasRunningSteps) {
          await client.query(
            "UPDATE afri_agent_execution_grants SET status = 'EXPIRED' WHERE grant_id = $1 AND status = 'ACTIVE'",
            [grantId]
          );
          await writeAuditEvent(client, {
            eventType: "AGENT_EXECUTION_GRANT_EXPIRED",
            outcome: "SUCCESS",
            details: { grantId }
          });
        }
        await client.query("COMMIT");
        transactionOpen = false;
        return null;
      }

      const stepResult = await client.query(
        "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND step_number = $2 FOR UPDATE",
        [grantId, stepNumber]
      );
      const step = stepResult.rows[0];
      if (!step) {
        await client.query("ROLLBACK");
        transactionOpen = false;
        return null;
      }

      if (action === "CLAIM") {
        if (step.status !== "PENDING" || step.target_agent_id !== targetAgentId || step.capability_id !== capabilityId) {
          await client.query("ROLLBACK");
          transactionOpen = false;
          return null;
        }

        const dependencies = await client.query(
          `SELECT COUNT(*)::int AS incomplete
           FROM afri_agent_execution_grant_steps
           WHERE grant_id = $1
             AND step_number IN (
               SELECT jsonb_array_elements_text(depends_on)::int
               FROM afri_agent_execution_grant_steps
               WHERE grant_id = $1 AND step_number = $2
             )
             AND status <> 'COMPLETED'`,
          [grantId, stepNumber]
        );

        if (Number(dependencies.rows[0]?.incomplete ?? 0) !== 0) {
          await client.query("ROLLBACK");
          transactionOpen = false;
          return null;
        }

        const updated = await client.query(
          "UPDATE afri_agent_execution_grant_steps SET status = 'RUNNING', started_at = $3, lease_expires_at = $4 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
          [grantId, stepNumber, now, leaseExpiresAt]
        );
        if (!updated.rows[0]) {
          await client.query("ROLLBACK");
          transactionOpen = false;
          return null;
        }

        await writeAuditEvent(client, {
          eventType: "AGENT_EXECUTION_STEP_CLAIMED",
          outcome: "SUCCESS",
          details: { grantId, stepNumber, targetAgentId, capabilityId }
        });
        await client.query("COMMIT");
        transactionOpen = false;

        const row = updated.rows[0];
        return {
          grantId: row.grant_id,
          stepNumber: Number(row.step_number),
          targetAgentId: row.target_agent_id,
          capabilityId: row.capability_id,
          task: row.task,
          dependsOn: row.depends_on,
          status: row.status,
          startedAt: Number(row.started_at),
          leaseExpiresAt: row.lease_expires_at === null ? null : Number(row.lease_expires_at)
        };
      }

      if (action === "SKIPPED" ? step.status !== "PENDING" : step.status !== "RUNNING") {
        await client.query("ROLLBACK");
        transactionOpen = false;
        return null;
      }


      if (action !== "SKIPPED") {
        const stepLeaseExpiresAt = step.lease_expires_at === null || step.lease_expires_at === undefined
          ? null
          : Number(step.lease_expires_at);
        if (!Number.isSafeInteger(stepLeaseExpiresAt) || stepLeaseExpiresAt <= now) {
          await client.query("ROLLBACK");
          transactionOpen = false;
          return null;
        }
      }
const updated = await client.query(
        "UPDATE afri_agent_execution_grant_steps SET status = $3, result_hash = $4, completed_at = $5 WHERE grant_id = $1 AND step_number = $2 RETURNING *",
        [grantId, stepNumber, action, resultHash ?? null, now]
      );
      if (!updated.rows[0]) throw new Error("AFRI_EXECUTION_GRANT_STEP_TRANSITION_FAILED");

      await writeAuditEvent(client, {
        eventType: `AGENT_EXECUTION_STEP_${action}`,
        outcome: action === "COMPLETED" ? "SUCCESS" : "FAILURE",
        details: {
          grantId,
          stepNumber,
          ...(errorCode ? { errorCode } : {}),
          ...(resultHash ? { resultHash } : {})
        }
      });

      if (Number(grant.expires_at) <= now) {
        const pendingSteps = await client.query(
          "SELECT * FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND status = 'PENDING' ORDER BY step_number FOR UPDATE",
          [grantId]
        );
        for (const pending of pendingSteps.rows ?? []) {
          const skipped = await client.query(
            "UPDATE afri_agent_execution_grant_steps SET status = 'SKIPPED', result_hash = NULL, completed_at = $3 WHERE grant_id = $1 AND step_number = $2 AND status = 'PENDING' RETURNING *",
            [grantId, pending.step_number, now]
          );
          if (skipped.rows[0]) {
            await writeAuditEvent(client, {
              eventType: "AGENT_EXECUTION_STEP_SKIPPED",
              outcome: "FAILURE",
              details: {
                grantId,
                stepNumber: Number(pending.step_number),
                errorCode: "GRANT_EXPIRED"
              }
            });
          }
        }

        const running = await client.query(
          "SELECT COUNT(*)::int AS running FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND status = 'RUNNING'",
          [grantId]
        );
        if (Number(running.rows[0]?.running ?? 0) === 0) {
          await client.query(
            "UPDATE afri_agent_execution_grants SET status = 'EXPIRED' WHERE grant_id = $1 AND status = 'ACTIVE'",
            [grantId]
          );
          await writeAuditEvent(client, {
            eventType: "AGENT_EXECUTION_GRANT_EXPIRED",
            outcome: "SUCCESS",
            details: { grantId }
          });
        }
      } else {
        const remaining = await client.query(
          "SELECT COUNT(*)::int AS remaining FROM afri_agent_execution_grant_steps WHERE grant_id = $1 AND status IN ('PENDING', 'RUNNING')",
          [grantId]
        );

        if (Number(remaining.rows[0]?.remaining ?? 0) === 0) {
          const all = await client.query(
            "SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed FROM afri_agent_execution_grant_steps WHERE grant_id = $1",
            [grantId]
          );
          const terminalStatus =
            Number(all.rows[0]?.total ?? 0) > 0 &&
            Number(all.rows[0].total) === Number(all.rows[0].completed)
              ? "COMPLETED"
              : "FAILED";

          await client.query(
            "UPDATE afri_agent_execution_grants SET status = $2 WHERE grant_id = $1 AND status = 'ACTIVE'",
            [grantId, terminalStatus]
          );
          await writeAuditEvent(client, {
            eventType: `AGENT_EXECUTION_GRANT_${terminalStatus}`,
            outcome: terminalStatus === "COMPLETED" ? "SUCCESS" : "FAILURE",
            details: { grantId }
          });
        }
      }

      await client.query("COMMIT");
      transactionOpen = false;
      const row = updated.rows[0];
      return {
        grantId: row.grant_id,
        stepNumber: Number(row.step_number),
        targetAgentId: row.target_agent_id,
        capabilityId: row.capability_id,
        task: row.task,
        dependsOn: row.depends_on,
        status: row.status,
        resultHash: row.result_hash,
        startedAt: row.started_at === null ? null : Number(row.started_at),
        leaseExpiresAt: row.lease_expires_at === null || row.lease_expires_at === undefined ? null : Number(row.lease_expires_at),
        completedAt: row.completed_at === null ? null : Number(row.completed_at)
      };
    } catch (error) {
      if (transactionOpen) {
        try { await client.query("ROLLBACK"); } catch {}
      }
      throw error;
    } finally {
      client.release();
    }
  }

}

export default AfriAgentApprovalPostgresRepository;
