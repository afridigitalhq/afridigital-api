import { createHash, randomUUID } from "node:crypto";

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function requiredId(value, code) {
  if (typeof value !== "string" || !value.trim()) fail(code);
  return value.trim();
}

const MAX_CANONICAL_DEPTH=16;
const MAX_CANONICAL_NODES=2048;
const MAX_CANONICAL_STRING_BYTES=16384;
const MAX_CANONICAL_ARRAY_LENGTH=256;
const MAX_CANONICAL_OBJECT_KEYS=64;

function canonicalize(value,state={nodes:0,seen:new WeakSet()},depth=0){
  state.nodes++;
  if(state.nodes>MAX_CANONICAL_NODES||depth>MAX_CANONICAL_DEPTH) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
  if(value===null||typeof value==="boolean") return value;
  if(typeof value==="string"){
    if(Buffer.byteLength(value,"utf8")>MAX_CANONICAL_STRING_BYTES) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
    return value;
  }
  if(typeof value==="number"&&Number.isFinite(value)) return value;
  if(!value||typeof value!=="object"||state.seen.has(value)) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
  state.seen.add(value);
  try{
    if(Array.isArray(value)){
      if(value.length>MAX_CANONICAL_ARRAY_LENGTH) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
      const keys=Reflect.ownKeys(value);
      if(keys.length!==value.length+1||keys.some(key=>key!=="length"&&(typeof key!=="string"||!/^(0|[1-9]\d*)$/.test(key)||Number(key)>=value.length))) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
      const result=[];
      for(let i=0;i<value.length;i++){
        const descriptor=Object.getOwnPropertyDescriptor(value,String(i));
        if(!descriptor||!("value" in descriptor)) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
        result.push(canonicalize(descriptor.value,state,depth+1));
      }
      return result;
    }
    if(Object.getPrototypeOf(value)!==Object.prototype) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
    const keys=Reflect.ownKeys(value);
    if(keys.length>MAX_CANONICAL_OBJECT_KEYS||keys.some(key=>typeof key!=="string"||["__proto__","prototype","constructor"].includes(key)||Buffer.byteLength(key,"utf8")>128)) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
    const result={};
    for(const key of keys.sort()){
      const descriptor=Object.getOwnPropertyDescriptor(value,key);
      if(!descriptor||!("value" in descriptor)) fail("AFRI_APPROVAL_PLAN_VALUE_INVALID");
      Object.defineProperty(result,key,{value:canonicalize(descriptor.value,state,depth+1),enumerable:true,writable:true,configurable:true});
    }
    return result;
  }finally{
    state.seen.delete(value);
  }
}

export function fingerprintAfriAgentExecutionPlan(plan) {
  if (
    !plan ||
    plan.status !== "PREVIEW" ||
    plan.planningMode !== "AI_STRUCTURED" ||
    plan.requiresApprovalBeforeDelegation !== true ||
    plan.executionStarted !== false ||
    plan.executionChannel !== "INTERNAL_ADMIN" ||
    plan.paymentPolicy !== "NO_AUTOMATIC_PAYMENT" ||
    !Array.isArray(plan.steps) ||
    plan.steps.length < 1 ||
    plan.steps.length > 12
  ) fail("AFRI_APPROVAL_PLAN_NOT_APPROVABLE");

  const snapshot = canonicalize({
    objective: plan.objective,
    summary: plan.summary,
    steps: plan.steps.map((step, index) => ({
      step: step.step ?? index + 1,
      agentId: step.agentId,
      capability: step.capability,
      task: step.task,
      dependsOn: step.dependsOn ?? []
    }))
  });

  if (
    typeof snapshot.objective !== "string" || !snapshot.objective.trim() ||
    typeof snapshot.summary !== "string" || !snapshot.summary.trim() ||
    snapshot.steps.some(step =>
      typeof step.agentId !== "string" ||
      typeof step.capability !== "string" ||
      typeof step.task !== "string" ||
      !Array.isArray(step.dependsOn)
    )
  ) fail("AFRI_APPROVAL_PLAN_SNAPSHOT_INVALID");

  return createHash("sha256")
    .update(JSON.stringify(snapshot), "utf8")
    .digest("hex");
}

export function createAfriAgentApprovalAuthorizer({ sessionService } = {}) {
  if (!sessionService || typeof sessionService.verifyPrincipal !== "function") {
    fail("AFRI_APPROVAL_IDENTITY_SERVICE_REQUIRED");
  }
  return async ({ approverId, principal } = {}) => {
    if (typeof approverId !== "string" || !principal || typeof principal !== "object") return false;
    const verified = await sessionService.verifyPrincipal(principal);
    return Boolean(
      verified &&
      verified.userId === approverId &&
      Array.isArray(verified.roles) &&
      verified.roles.includes("AGENT_APPROVER")
    );
  };
}

function assertRepository(repository) {
  const methods = ["create", "get", "approvePending", "rejectPending", "consumeApproved"];
  if (!repository || methods.some(method => typeof repository[method] !== "function")) {
    fail("AFRI_APPROVAL_ATOMIC_REPOSITORY_REQUIRED");
  }
}

export class AfriAgentApprovalAuthority {
  constructor({
    repository, authorizeApprover, auditRepository,
    clock = Date.now, ttlMs = 900000, grantTtlMs = 900000, executionLeaseMs = 30 * 60 * 1000
  } = {}) {
    assertRepository(repository);
    if (typeof authorizeApprover !== "function") fail("AFRI_APPROVAL_AUTHORIZER_REQUIRED");
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 1000) fail("AFRI_APPROVAL_TTL_INVALID");
    if (!Number.isSafeInteger(grantTtlMs) || grantTtlMs < 1000) fail("AFRI_EXECUTION_GRANT_TTL_INVALID");
    if (!Number.isSafeInteger(executionLeaseMs) || executionLeaseMs < 1000) fail("AFRI_EXECUTION_LEASE_INVALID");
    if (typeof clock !== "function") fail("AFRI_APPROVAL_CLOCK_INVALID");

    this.repository = repository;
    this.authorizeApprover = authorizeApprover;
    this.auditRepository = auditRepository;
    this.clock = clock;
    this.ttlMs = ttlMs;
    this.grantTtlMs = grantTtlMs;
    this.executionLeaseMs = executionLeaseMs;
  }

  async request({ sourceAgentId, requestedBy, plan } = {}) {
    const source = requiredId(sourceAgentId, "AFRI_APPROVAL_SOURCE_REQUIRED");
    const requester = requiredId(requestedBy, "AFRI_APPROVAL_REQUESTER_REQUIRED");
    const fingerprint = fingerprintAfriAgentExecutionPlan(plan);
    const now = this.clock();

    const record = {
      approvalId: randomUUID(),
      sourceAgentId: source,
      requestedBy: requester,
      planFingerprint: fingerprint,
      status: "PENDING",
      createdAt: now,
      expiresAt: now + this.ttlMs,
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      consumedAt: null
    };

    await this.repository.create(record);
    return Object.freeze({ ...record });
  }

  async approve({ approvalId, approverId, principal } = {}) {
    const id = requiredId(approvalId, "AFRI_APPROVAL_ID_REQUIRED");
    const approver = requiredId(approverId, "AFRI_APPROVAL_APPROVER_REQUIRED");
    if (!principal || typeof principal !== "object") fail("AFRI_APPROVAL_PRINCIPAL_REQUIRED");
    const record = await this.repository.get(id);

    if (!record) fail("AFRI_APPROVAL_NOT_FOUND");
    if (record.status !== "PENDING") fail("AFRI_APPROVAL_NOT_PENDING");
    if (record.expiresAt <= this.clock()) fail("AFRI_APPROVAL_EXPIRED");
    if (approver === record.requestedBy) fail("AFRI_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED");

    let authorized = false;
    try {
      authorized = await this.authorizeApprover({
        approverId: approver,
        principal,
        approval: Object.freeze({ ...record })
      }) === true;
    } catch {
      authorized = false;
    }
    if (!authorized) fail("AFRI_APPROVAL_APPROVER_FORBIDDEN");

    const updated = await this.repository.approvePending(id, {
      approvedBy: approver,
      approvedAt: this.clock()
    });
    if (!updated) fail("AFRI_APPROVAL_NOT_PENDING");
    return Object.freeze({ ...updated });
  }

  async reject({ approvalId, approverId, principal, reason = null } = {}) {
    const id = requiredId(approvalId, "AFRI_APPROVAL_ID_REQUIRED");
    const approver = requiredId(approverId, "AFRI_APPROVAL_APPROVER_REQUIRED");
    if (!principal || typeof principal !== "object") fail("AFRI_APPROVAL_PRINCIPAL_REQUIRED");
    const record = await this.repository.get(id);

    if (!record) fail("AFRI_APPROVAL_NOT_FOUND");
    if (record.status !== "PENDING") fail("AFRI_APPROVAL_NOT_PENDING");
    if (record.expiresAt <= this.clock()) fail("AFRI_APPROVAL_EXPIRED");
    if (approver === record.requestedBy) fail("AFRI_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED");

    let authorized = false;
    try {
      authorized = await this.authorizeApprover({
        approverId: approver,
        principal,
        approval: Object.freeze({ ...record })
      }) === true;
    } catch {
      authorized = false;
    }
    if (!authorized) fail("AFRI_APPROVAL_APPROVER_FORBIDDEN");

    const updated = await this.repository.rejectPending(id, {
      rejectedBy: approver,
      rejectedAt: this.clock(),
      rejectionReason: reason === null ? null : String(reason).slice(0, 500)
    });
    if (!updated) fail("AFRI_APPROVAL_NOT_PENDING");
    return Object.freeze({ ...updated });
  }

  async consumeAndCreateGrant({ approvalId, sourceAgentId, requesterId, plan } = {}) {
    const id = requiredId(approvalId, "AFRI_APPROVAL_ID_REQUIRED");
    const source = requiredId(sourceAgentId, "AFRI_APPROVAL_SOURCE_REQUIRED");
    const requester = requiredId(requesterId, "AFRI_APPROVAL_REQUESTER_REQUIRED");
    const fingerprint = fingerprintAfriAgentExecutionPlan(plan);

    if (typeof this.repository.consumeApprovedAndCreateExecutionGrant !== "function") {
      fail("AFRI_EXECUTION_GRANT_REPOSITORY_REQUIRED");
    }
    if (!this.auditRepository || typeof this.auditRepository.appendAuditEvent !== "function") {
      fail("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const now = this.clock();
    const grant = {
      grantId: randomUUID(),
      approvalId: id,
      sourceAgentId: source,
      requesterId: requester,
      planFingerprint: fingerprint,
      objective: plan.objective,
      summary: plan.summary,
      createdAt: now,
      expiresAt: now + this.grantTtlMs,
      status: "ACTIVE"
    };
    const steps = plan.steps.map((step, index) => ({
      stepNumber: step.step ?? index + 1,
      targetAgentId: step.agentId,
      capabilityId: step.capability,
      task: step.task,
      dependsOn: step.dependsOn ?? [],
      status: "PENDING"
    }));

    const event = {
      eventId: randomUUID(),
      actorUserId: null,
      eventType: "AGENT_EXECUTION_GRANT_CREATED",
      subjectUserId: null,
      outcome: "SUCCESS",
      details: {
        approvalId: id,
        grantId: grant.grantId,
        sourceAgentId: source,
        requesterId: requester,
        planFingerprint: fingerprint,
        stepCount: steps.length
      },
      createdAt: now
    };

    const result = await this.repository.consumeApprovedAndCreateExecutionGrant({
      approvalId: id,
      sourceAgentId: source,
      requesterId: requester,
      planFingerprint: fingerprint,
      consumedAt: now,
      grant,
      steps,
      writeAuditEvent: client => this.auditRepository.appendAuditEvent({
        ...event,
        client
      })
    });

    if (!result) fail("AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED");
    return Object.freeze({
      approval: Object.freeze({ ...result.approval }),
      grant: Object.freeze({ ...result.grant }),
      steps: Object.freeze(result.steps.map(step => Object.freeze({ ...step })))
    });
  }



  async issueExecutionReceipt({ envelope } = {}) {
    const { fingerprintAfriAgentExecutionReceipt } = await import("./AfriAgentExecutionReceipt.js");
    const checked = fingerprintAfriAgentExecutionReceipt(envelope);
    if (!this.auditRepository || typeof this.auditRepository.appendAuditEvent !== "function") {
      fail("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const token = (await import("node:crypto")).randomBytes(32).toString("base64url");
    const receiptId = createHash("sha256").update(token, "utf8").digest("hex");
    const now = this.clock();
    const expiresAt = now + Math.min(60000, this.grantTtlMs);
    const result = await this.repository.issueExecutionReceipt({
      receiptId,
      grantId: envelope.grantId,
      stepNumber: envelope.stepNumber,
      sourceAgentId: envelope.sourceAgentId,
      targetAgentId: envelope.targetAgentId,
      capabilityId: envelope.capabilityId,
      planObjective: envelope.planObjective,
      planSummary: envelope.planSummary,
      objective: envelope.objective,
      dependsOn: envelope.dependsOn,
      ...checked,
      now,
      expiresAt,
      writeAuditEvent: (client, transition = {}) => this.auditRepository.appendAuditEvent({
        eventId: randomUUID(),
        actorUserId: null,
        eventType: transition.eventType,
        subjectUserId: null,
        outcome: transition.outcome,
        details: {
          grantId: envelope.grantId,
          stepNumber: envelope.stepNumber,
          sourceAgentId: envelope.sourceAgentId,
          targetAgentId: envelope.targetAgentId,
          capabilityId: envelope.capabilityId
        },
        createdAt: now,
        client
      })
    });

    if (!result) fail("AFRI_RECEIPT_ISSUANCE_REJECTED");
    return Object.freeze({ token, expiresAt });
  }

  async consumeExecutionReceipt({ token, envelope } = {}) {
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,60}$/.test(token)) {
      fail("AFRI_RECEIPT_TOKEN_INVALID");
    }
    const { fingerprintAfriAgentExecutionReceipt } = await import("./AfriAgentExecutionReceipt.js");
    const checked = fingerprintAfriAgentExecutionReceipt(envelope);
    if (!this.auditRepository || typeof this.auditRepository.appendAuditEvent !== "function") {
      fail("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const receiptId = createHash("sha256").update(token, "utf8").digest("hex");
    const now = this.clock();
    const result = await this.repository.consumeExecutionReceipt({
      receiptId,
      grantId: envelope.grantId,
      stepNumber: envelope.stepNumber,
      sourceAgentId: envelope.sourceAgentId,
      targetAgentId: envelope.targetAgentId,
      capabilityId: envelope.capabilityId,
      planObjective: envelope.planObjective,
      planSummary: envelope.planSummary,
      objective: envelope.objective,
      dependsOn: envelope.dependsOn,
      ...checked,
      now,
      writeAuditEvent: (client, transition = {}) => this.auditRepository.appendAuditEvent({
        eventId: randomUUID(),
        actorUserId: null,
        eventType: transition.eventType,
        subjectUserId: null,
        outcome: transition.outcome,
        details: {
          grantId: envelope.grantId,
          stepNumber: envelope.stepNumber,
          sourceAgentId: envelope.sourceAgentId,
          targetAgentId: envelope.targetAgentId,
          capabilityId: envelope.capabilityId
        },
        createdAt: now,
        client
      })
    });

    if (!result) fail("AFRI_RECEIPT_VERIFICATION_REJECTED");
    return result;
  }

  async claimGrantStep({ grantId, stepNumber, targetAgentId, capabilityId } = {}) {
    return this._transitionGrantStep("claimExecutionGrantStep", {
      grantId, stepNumber, targetAgentId, capabilityId
    });
  }

  async completeGrantStep({ grantId, stepNumber, resultHash } = {}) {
    if (typeof resultHash !== "string" || !/^[a-f0-9]{64}$/.test(resultHash)) {
      fail("AFRI_EXECUTION_GRANT_RESULT_HASH_INVALID");
    }
    return this._transitionGrantStep("completeExecutionGrantStep", {
      grantId, stepNumber, resultHash
    });
  }

  async failGrantStep({ grantId, stepNumber, errorCode } = {}) {
    return this._transitionGrantStep("failExecutionGrantStep", {
      grantId, stepNumber,
      errorCode: this._safeGrantErrorCode(errorCode)
    });
  }

  async skipGrantStep({ grantId, stepNumber, errorCode } = {}) {
    return this._transitionGrantStep("skipExecutionGrantStep", {
      grantId, stepNumber,
      errorCode: this._safeGrantErrorCode(errorCode)
    });
  }

  _safeGrantErrorCode(value) {
    if (typeof value !== "string" || !/^[A-Z][A-Z0-9_]{2,99}$/.test(value)) {
      return "AGENT_EXECUTION_FAILED";
    }
    return value;
  }

  async recoverExpiredGrantSteps() {
    const method = this.repository.recoverExpiredExecutionGrantSteps;
    if (typeof method !== "function") fail("AFRI_EXECUTION_GRANT_RECOVERY_REPOSITORY_REQUIRED");
    if (!this.auditRepository || typeof this.auditRepository.appendAuditEvent !== "function") {
      fail("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }
    const now = this.clock();
    const result = await method.call(this.repository, {
      now,
      writeAuditEvent: (client, transition = {}) => this.auditRepository.appendAuditEvent({
        eventId: randomUUID(),
        actorUserId: null,
        eventType: transition.eventType,
        subjectUserId: null,
        outcome: transition.outcome,
        details: transition.details ?? {},
        createdAt: now,
        client
      })
    });
    return Object.freeze(result ?? { recovered: 0, skipped: 0, grantsFinalized: 0 });
  }

  async _transitionGrantStep(repositoryMethod, input) {
    const grantId = requiredId(input.grantId, "AFRI_EXECUTION_GRANT_ID_REQUIRED");
    if (!Number.isSafeInteger(input.stepNumber) || input.stepNumber < 1 || input.stepNumber > 12) {
      fail("AFRI_EXECUTION_GRANT_STEP_NUMBER_INVALID");
    }
    if (repositoryMethod === "claimExecutionGrantStep") {
      requiredId(input.targetAgentId, "AFRI_EXECUTION_GRANT_TARGET_REQUIRED");
      requiredId(input.capabilityId, "AFRI_EXECUTION_GRANT_CAPABILITY_REQUIRED");
    }

    const method = this.repository[repositoryMethod];
    if (typeof method !== "function") fail("AFRI_EXECUTION_GRANT_REPOSITORY_REQUIRED");
    if (!this.auditRepository || typeof this.auditRepository.appendAuditEvent !== "function") {
      fail("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
    }

    const now = this.clock();
    const leaseExpiresAt = repositoryMethod === "claimExecutionGrantStep" ? now + this.executionLeaseMs : undefined;
    if (leaseExpiresAt !== undefined && !Number.isSafeInteger(leaseExpiresAt)) fail("AFRI_EXECUTION_LEASE_INVALID");
    const result = await method.call(this.repository, {
      ...input,
      grantId,
      now,
      ...(leaseExpiresAt !== undefined ? { leaseExpiresAt } : {}),
      writeAuditEvent: (client, transition = {}) => this.auditRepository.appendAuditEvent({
        eventId: randomUUID(),
        actorUserId: null,
        eventType: transition.eventType,
        subjectUserId: null,
        outcome: transition.outcome,
        details: transition.details ?? { grantId, stepNumber: input.stepNumber },
        createdAt: now,
        client
      })
    });

    return result ? Object.freeze({ ...result }) : null;
  }

  async consume({ approvalId, sourceAgentId, requesterId, plan } = {}) {
    const id = requiredId(approvalId, "AFRI_APPROVAL_ID_REQUIRED");
    const source = requiredId(sourceAgentId, "AFRI_APPROVAL_SOURCE_REQUIRED");
    const requester = requiredId(requesterId, "AFRI_APPROVAL_REQUESTER_REQUIRED");
    const fingerprint = fingerprintAfriAgentExecutionPlan(plan);

    const record = await this.repository.consumeApproved({
      approvalId: id,
      sourceAgentId: source,
      requesterId: requester,
      planFingerprint: fingerprint,
      consumedAt: this.clock()
    });

    if (!record) fail("AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED");
    return Object.freeze({ ...record });
  }
}

export default AfriAgentApprovalAuthority;
