/**
 * TEST ONLY. Process-local storage is not suitable for production approval records.
 */
export class AfriAgentApprovalMemoryRepository {
  constructor() {
    this.records = new Map();
    this.receipts = new Map();
  }

  async create(record) {
    if (this.records.has(record.approvalId)) throw new Error("AFRI_APPROVAL_DUPLICATE_ID");
    this.records.set(record.approvalId, structuredClone(record));
    return structuredClone(record);
  }

  async get(id) {
    const record = this.records.get(id);
    return record ? structuredClone(record) : null;
  }

  async approvePending(id, patch) {
    const record = this.records.get(id);
    if (!record || record.status !== "PENDING") return null;
    Object.assign(record, structuredClone(patch), { status: "APPROVED" });
    return structuredClone(record);
  }

  async rejectPending(id, patch) {
    const record = this.records.get(id);
    if (!record || record.status !== "PENDING") return null;
    Object.assign(record, structuredClone(patch), { status: "REJECTED" });
    return structuredClone(record);
  }

  async consumeApprovedAndCreateExecutionGrant({
    approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt,
    grant, steps, writeAuditEvent
  } = {}) {
    const previous = await this.get(approvalId);
    const consumed = await this.consumeApproved({
      approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt
    });
    if (!consumed) return null;

    this.grants ??= new Map();
    this.grantSteps ??= new Map();
    try {
      if (this.grants.has(grant.grantId)) throw new Error("AFRI_EXECUTION_GRANT_DUPLICATE_ID");
      this.grants.set(grant.grantId, structuredClone(grant));
      this.grantSteps.set(grant.grantId, structuredClone(steps));
      await writeAuditEvent({ query: async () => ({ rows: [] }) });
      return {
        approval: consumed,
        grant: structuredClone(grant),
        steps: structuredClone(steps)
      };
    } catch (error) {
      this.records.set(approvalId, previous);
      this.grants.delete(grant.grantId);
      this.grantSteps.delete(grant.grantId);
      throw error;
    }
  }


  async claimExecutionGrantStep(input = {}) {
    return this._transitionExecutionGrantStep({ ...input, action: "CLAIM" });
  }

  async completeExecutionGrantStep(input = {}) {
    return this._transitionExecutionGrantStep({ ...input, action: "COMPLETED" });
  }

  async failExecutionGrantStep(input = {}) {
    return this._transitionExecutionGrantStep({ ...input, action: "FAILED" });
  }

  async skipExecutionGrantStep(input = {}) {
    return this._transitionExecutionGrantStep({ ...input, action: "SKIPPED" });
  }

  async _transitionExecutionGrantStep({
    action, grantId, stepNumber, now, targetAgentId, capabilityId, leaseExpiresAt,
    resultHash, errorCode, writeAuditEvent
  } = {}) {
    this.grants ??= new Map();
    this.grantSteps ??= new Map();

    if (!["CLAIM", "COMPLETED", "FAILED", "SKIPPED"].includes(action) ||
        typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_TRANSITION_INPUT_INVALID");
    }

    const grant = this.grants.get(grantId);
    if (!grant || grant.status !== "ACTIVE") return null;

    const steps = this.grantSteps.get(grantId);
    if (!Array.isArray(steps)) return null;
    if (action === "CLAIM" && grant.expiresAt <= now) {
      const previousGrant = structuredClone(grant);
      const previousSteps = structuredClone(steps);
      const pendingSteps = steps.filter(item => item.status === "PENDING");
      const hasRunningSteps = steps.some(item => item.status === "RUNNING");

      for (const pending of pendingSteps) {
        Object.assign(pending, { status: "SKIPPED", resultHash: null, completedAt: now });
      }
      if (!hasRunningSteps) grant.status = "EXPIRED";

      try {
        const client = { query: async () => ({ rows: [] }) };
        for (const pending of pendingSteps) {
          await writeAuditEvent(client, {
            eventType: "AGENT_EXECUTION_STEP_SKIPPED",
            outcome: "FAILURE",
            details: { grantId, stepNumber: pending.stepNumber, errorCode: "GRANT_EXPIRED" }
          });
        }
        if (!hasRunningSteps) {
          await writeAuditEvent(client, {
            eventType: "AGENT_EXECUTION_GRANT_EXPIRED",
            outcome: "SUCCESS",
            details: { grantId }
          });
        }
      } catch (error) {
        this.grants.set(grantId, previousGrant);
        this.grantSteps.set(grantId, previousSteps);
        throw error;
      }
      return null;
    }

    const step = steps.find(item => item.stepNumber === stepNumber);
    if (!step) return null;

    if (action === "CLAIM") {
      if (step.status !== "PENDING" ||
          step.targetAgentId !== targetAgentId ||
          step.capabilityId !== capabilityId) return null;

      const dependenciesReady = (step.dependsOn ?? []).every(dependency => {
        const dependencyStep = steps.find(item => item.stepNumber === dependency);
        return dependencyStep?.status === "COMPLETED";
      });
      if (!dependenciesReady) return null;

      const previousSteps = structuredClone(steps);
      Object.assign(step, {
        status: "RUNNING",
        startedAt: now,
        leaseExpiresAt
      });

      try {
        const client = { query: async () => ({ rows: [] }) };
        await writeAuditEvent(client, {
          eventType: "AGENT_EXECUTION_STEP_CLAIMED",
          outcome: "SUCCESS",
          details: { grantId, stepNumber, targetAgentId, capabilityId }
        });
      } catch (error) {
        this.grantSteps.set(grantId, previousSteps);
        throw error;
      }

      return structuredClone(step);
    }

    if (action === "SKIPPED" ? step.status !== "PENDING" : step.status !== "RUNNING") {
      return null;
    }


    if (action !== "SKIPPED" &&
        (!Number.isSafeInteger(step.leaseExpiresAt) || step.leaseExpiresAt <= now)) {
      return null;
    }
const previousGrant = structuredClone(grant);
    const previousSteps = structuredClone(steps);
    const expired = grant.expiresAt <= now;

    Object.assign(step, {
      status: action,
      resultHash: resultHash ?? null,
      completedAt: now
    });

    const expiredPendingSteps = expired
      ? steps.filter(item => item.status === "PENDING")
      : [];
    for (const pending of expiredPendingSteps) {
      Object.assign(pending, {
        status: "SKIPPED",
        resultHash: null,
        completedAt: now
      });
    }

    let terminalEvent = null;
    if (expired) {
      const hasRunningSteps = steps.some(item => item.status === "RUNNING");
      if (!hasRunningSteps) {
        grant.status = "EXPIRED";
        terminalEvent = {
          eventType: "AGENT_EXECUTION_GRANT_EXPIRED",
          outcome: "SUCCESS",
          details: { grantId }
        };
      }
    } else {
      const remaining = steps.some(item => item.status === "PENDING" || item.status === "RUNNING");
      if (!remaining) {
        const allCompleted = steps.length > 0 && steps.every(item => item.status === "COMPLETED");
        grant.status = allCompleted ? "COMPLETED" : "FAILED";
        terminalEvent = {
          eventType: `AGENT_EXECUTION_GRANT_${grant.status}`,
          outcome: allCompleted ? "SUCCESS" : "FAILURE",
          details: { grantId }
        };
      }
    }

    try {
      const client = { query: async () => ({ rows: [] }) };
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
      for (const pending of expiredPendingSteps) {
        await writeAuditEvent(client, {
          eventType: "AGENT_EXECUTION_STEP_SKIPPED",
          outcome: "FAILURE",
          details: {
            grantId,
            stepNumber: pending.stepNumber,
            errorCode: "GRANT_EXPIRED"
          }
        });
      }
      if (terminalEvent) await writeAuditEvent(client, terminalEvent);
    } catch (error) {
      this.grants.set(grantId, previousGrant);
      this.grantSteps.set(grantId, previousSteps);
      throw error;
    }

    return structuredClone(step);
  }

  async recoverExpiredExecutionGrantSteps({ now, writeAuditEvent } = {}) {
    this.grants ??= new Map();
    this.grantSteps ??= new Map();
    if (!Number.isSafeInteger(now) || typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_RECOVERY_INPUT_INVALID");
    }

    const previousGrants = structuredClone(this.grants);
    const previousGrantSteps = structuredClone(this.grantSteps);
    const client = { query: async () => ({ rows: [] }) };
    let recovered = 0;
    let skipped = 0;
    let grantsFinalized = 0;

    const audit = (eventType, outcome, details) =>
      writeAuditEvent(client, { eventType, outcome, details });

    try {
      for (const [grantId, grant] of this.grants) {
        if (grant.status !== "ACTIVE") continue;
        const steps = this.grantSteps.get(grantId);
        if (!Array.isArray(steps)) continue;

        for (const step of steps) {
          if (step.status !== "RUNNING" ||
              (Number.isSafeInteger(step.leaseExpiresAt) && step.leaseExpiresAt > now)) continue;

          Object.assign(step, {
            status: "FAILED",
            resultHash: null,
            errorCode: "EXECUTION_LEASE_EXPIRED",
            completedAt: now
          });
          recovered++;
          await audit("AGENT_EXECUTION_STEP_FAILED", "FAILURE", {
            grantId, stepNumber: step.stepNumber, errorCode: "EXECUTION_LEASE_EXPIRED"
          });
        }

        let changed = true;
        while (changed) {
          changed = false;
          for (const step of steps) {
            if (step.status !== "PENDING") continue;
            const failedDependency = (step.dependsOn ?? []).some(dependency => {
              const dependencyStep = steps.find(item => item.stepNumber === dependency);
              return dependencyStep && ["FAILED", "SKIPPED"].includes(dependencyStep.status);
            });
            if (!failedDependency) continue;

            Object.assign(step, {
              status: "SKIPPED",
              resultHash: null,
              errorCode: "DEPENDENCY_FAILED",
              completedAt: now
            });
            skipped++;
            changed = true;
            await audit("AGENT_EXECUTION_STEP_SKIPPED", "FAILURE", {
              grantId, stepNumber: step.stepNumber, errorCode: "DEPENDENCY_FAILED"
            });
          }
        }

        if (grant.expiresAt <= now) {
          for (const step of steps) {
            if (step.status !== "PENDING") continue;
            Object.assign(step, {
              status: "SKIPPED",
              resultHash: null,
              errorCode: "GRANT_EXPIRED",
              completedAt: now
            });
            skipped++;
            await audit("AGENT_EXECUTION_STEP_SKIPPED", "FAILURE", {
              grantId, stepNumber: step.stepNumber, errorCode: "GRANT_EXPIRED"
            });
          }

          const hasRunningSteps = steps.some(step => step.status === "RUNNING");
          if (!hasRunningSteps) {
            grant.status = "EXPIRED";
            grantsFinalized++;
            await audit("AGENT_EXECUTION_GRANT_EXPIRED", "SUCCESS", { grantId });
          }
          continue;
        }

        const hasNonTerminalSteps = steps.some(step =>
          step.status === "PENDING" || step.status === "RUNNING"
        );
        if (!hasNonTerminalSteps) {
          const allCompleted = steps.length > 0 &&
            steps.every(step => step.status === "COMPLETED");
          grant.status = allCompleted ? "COMPLETED" : "FAILED";
          grantsFinalized++;
          await audit(
            `AGENT_EXECUTION_GRANT_${grant.status}`,
            allCompleted ? "SUCCESS" : "FAILURE",
            { grantId }
          );
        }
      }
    } catch (error) {
      this.grants = previousGrants;
      this.grantSteps = previousGrantSteps;
      throw error;
    }

    return { recovered, skipped, grantsFinalized };
  }

  async issueExecutionReceipt(input = {}) {
    const {
      receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
      capabilityId, planObjective, planSummary, objective, dependsOn,
      objectiveHash, dependenciesHash, dependencyResultsHash, envelopeHash,
      now, expiresAt, writeAuditEvent
    } = input;

    if (typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const grant = this.grants?.get(grantId);
    const steps = this.grantSteps?.get(grantId);
    const step = steps?.find(item => item.stepNumber === stepNumber);

    if (
      !grant || grant.status !== "ACTIVE" || grant.expiresAt <= now ||
      grant.sourceAgentId !== sourceAgentId ||
      grant.objective !== planObjective || grant.summary !== planSummary ||
      !step || step.status !== "RUNNING" ||
      !Number.isSafeInteger(step.leaseExpiresAt) || step.leaseExpiresAt <= now ||
      step.targetAgentId !== targetAgentId ||
      step.capabilityId !== capabilityId ||
      step.task !== objective ||
      JSON.stringify(step.dependsOn) !== JSON.stringify(dependsOn) ||
      expiresAt <= now || expiresAt > grant.expiresAt || expiresAt > step.leaseExpiresAt ||
      [...this.receipts.values()].some(item =>
        item.grantId === grantId && item.stepNumber === stepNumber
      )
    ) return null;

    const receipt = {
      receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
      capabilityId, planObjective, planSummary, objective,
      dependsOn: structuredClone(dependsOn),
      objectiveHash, dependenciesHash, dependencyResultsHash, envelopeHash,
      issuedAt: now, expiresAt, consumedAt: null
    };

    this.receipts.set(receiptId, receipt);
    try {
      await writeAuditEvent({ query: async () => ({ rows: [] }) }, {
        eventType: "AGENT_EXECUTION_RECEIPT_ISSUED",
        outcome: "SUCCESS",
        details: { grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId }
      });
    } catch (error) {
      this.receipts.delete(receiptId);
      throw error;
    }

    return Object.freeze({ grantId, stepNumber, expiresAt });
  }

  async consumeExecutionReceipt(input = {}) {
    const {
      receiptId, grantId, stepNumber, sourceAgentId, targetAgentId,
      capabilityId, planObjective, planSummary, objective, dependsOn,
      objectiveHash, dependenciesHash, dependencyResultsHash, envelopeHash,
      now, writeAuditEvent
    } = input;

    if (typeof writeAuditEvent !== "function") {
      throw new Error("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const receipt = this.receipts.get(receiptId);
    const grant = this.grants?.get(grantId);
    const step = this.grantSteps?.get(grantId)?.find(item => item.stepNumber === stepNumber);

    if (
      !receipt || receipt.consumedAt !== null || receipt.expiresAt <= now ||
      receipt.grantId !== grantId || receipt.stepNumber !== stepNumber ||
      receipt.sourceAgentId !== sourceAgentId ||
      receipt.targetAgentId !== targetAgentId ||
      receipt.capabilityId !== capabilityId ||
      receipt.planObjective !== planObjective ||
      receipt.planSummary !== planSummary ||
      receipt.objective !== objective ||
      JSON.stringify(receipt.dependsOn) !== JSON.stringify(dependsOn) ||
      receipt.objectiveHash !== objectiveHash ||
      receipt.dependenciesHash !== dependenciesHash ||
      receipt.dependencyResultsHash !== dependencyResultsHash ||
      receipt.envelopeHash !== envelopeHash ||
      receipt.expiresAt > step.leaseExpiresAt ||
      !grant || grant.status !== "ACTIVE" || grant.expiresAt <= now ||
      grant.sourceAgentId !== sourceAgentId ||
      grant.objective !== planObjective || grant.summary !== planSummary ||
      !step || step.status !== "RUNNING" ||
      !Number.isSafeInteger(step.leaseExpiresAt) || step.leaseExpiresAt <= now ||
      step.targetAgentId !== targetAgentId ||
      step.capabilityId !== capabilityId ||
      step.task !== objective ||
      JSON.stringify(step.dependsOn) !== JSON.stringify(dependsOn)
    ) return null;

    const previousConsumedAt = receipt.consumedAt;
    receipt.consumedAt = now;
    try {
      await writeAuditEvent({ query: async () => ({ rows: [] }) }, {
        eventType: "AGENT_EXECUTION_RECEIPT_CONSUMED",
        outcome: "SUCCESS",
        details: { grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId }
      });
    } catch (error) {
      receipt.consumedAt = previousConsumedAt;
      throw error;
    }

    return Object.freeze({
      grantId, stepNumber, sourceAgentId, targetAgentId, capabilityId,
      verified: true
    });
  }

  async consumeApproved({ approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt }) {
    const record = this.records.get(approvalId);

    if (
      !record ||
      record.status !== "APPROVED" ||
      record.sourceAgentId !== sourceAgentId ||
      record.requestedBy !== requesterId ||
      record.planFingerprint !== planFingerprint ||
      record.expiresAt <= consumedAt ||
      record.consumedAt !== null
    ) return null;

    Object.assign(record, { status: "CONSUMED", consumedAt });
    return structuredClone(record);
  }
}

export default AfriAgentApprovalMemoryRepository;
