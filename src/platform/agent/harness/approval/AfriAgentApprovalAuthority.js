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
  constructor({ repository, authorizeApprover, clock = Date.now, ttlMs = 900000 } = {}) {
    assertRepository(repository);
    if (typeof authorizeApprover !== "function") fail("AFRI_APPROVAL_AUTHORIZER_REQUIRED");
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 1000) fail("AFRI_APPROVAL_TTL_INVALID");
    if (typeof clock !== "function") fail("AFRI_APPROVAL_CLOCK_INVALID");

    this.repository = repository;
    this.authorizeApprover = authorizeApprover;
    this.clock = clock;
    this.ttlMs = ttlMs;
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
