import { createHash, randomUUID } from "node:crypto";
import { createAfriAgentApprovalAuthorizer } from "../approval/AfriAgentApprovalAuthority.js";
import { verifyAfriAgentArtifactHash } from "./AfriAgentArtifactIntegrity.js";

const MAX_CHANGES = 8;
const MAX_FILE_BYTES = 65536;
const MAX_TOTAL_BYTES = 131072;
const MAX_REASON = 500;
const SAFE_SEGMENT = /^(?!\.{1,2}$)[A-Za-z0-9._@+-]+$/;
const FORBIDDEN = new Set([".git", ".afriagents", ".africrypto", "node_modules"]);

function safeProposalPath(path) {
  if (typeof path !== "string" || !path.trim() || path.length > 240 ||
      path.startsWith("/") || path.includes("\\") ||
      path.includes("\0") || /^[A-Za-z]:/.test(path)) return false;
  const segments = path.split("/");
  if (segments.some(segment => !segment || segment === "." || segment === ".." ||
      segment.toLowerCase().startsWith(".env") || !SAFE_SEGMENT.test(segment) ||
      FORBIDDEN.has(segment.toLowerCase()))) return false;
  const filename = segments.at(-1).toLowerCase();
  return !(/\.(pem|key|p12|pfx|keystore|jks)$/.test(filename) ||
      /(secret|credential|private[-_]?key)/i.test(filename));
}

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function requiredId(value, code) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 128) fail(code);
  return value.trim();
}

function assertRepository(repository) {
  const methods = ["create", "get", "approvePending", "rejectPending", "consumeApproved"];
  if (!repository || methods.some(method => typeof repository[method] !== "function")) {
    fail("AFRI_ARTIFACT_APPROVAL_ATOMIC_REPOSITORY_REQUIRED");
  }
}

function parseProposal(version) {
  if (!version || !Buffer.isBuffer(version.content)) fail("AFRI_ARTIFACT_PROPOSAL_CONTENT_REQUIRED");
  if (!verifyAfriAgentArtifactHash(version.content, version.checksumSha256)) {
    fail("AFRI_ARTIFACT_INTEGRITY_FAILURE");
  }

  let proposal;
  try {
    proposal = JSON.parse(version.content.toString("utf8"));
  } catch {
    fail("AFRI_ARTIFACT_PROPOSAL_JSON_INVALID");
  }

  if (!proposal || Object.getPrototypeOf(proposal) !== Object.prototype) fail("AFRI_ARTIFACT_PROPOSAL_INVALID");
  if (Object.keys(proposal).some(key => !["status", "summary", "changes"].includes(key))) fail("AFRI_ARTIFACT_PROPOSAL_FIELDS_FORBIDDEN");
  if (
    !proposal || Object.getPrototypeOf(proposal) !== Object.prototype ||
    proposal.status !== "PATCH_PROPOSAL_READY" ||
    typeof proposal.summary !== "string" || !proposal.summary.trim() ||
    proposal.summary.length > 1000 ||
    !Array.isArray(proposal.changes) ||
    proposal.changes.length < 1 || proposal.changes.length > MAX_CHANGES
  ) fail("AFRI_ARTIFACT_PROPOSAL_INVALID");

  let totalBytes = 0;
  const seen = new Set();
  const changes = proposal.changes.map(change => {
    if (!change || Object.getPrototypeOf(change) !== Object.prototype) {
      fail("AFRI_ARTIFACT_CHANGE_INVALID");
    }
    if (Object.keys(change).some(key => !["path", "operation", "content"].includes(key))) fail("AFRI_ARTIFACT_CHANGE_FIELDS_FORBIDDEN");
    const path = change.path;
    const operation = change.operation;
    const content = change.content;

    if (!safeProposalPath(path)) fail("AFRI_ARTIFACT_CHANGE_PATH_INVALID");

    if (seen.has(path)) fail("AFRI_ARTIFACT_CHANGE_PATH_DUPLICATE");
    seen.add(path);

    if (!["create", "modify"].includes(operation)) fail("AFRI_ARTIFACT_CHANGE_OPERATION_INVALID");
    if (typeof content !== "string" || !content.length || content.includes("\0")) {
      fail("AFRI_ARTIFACT_CHANGE_CONTENT_INVALID");
    }
    const bytes = Buffer.byteLength(content, "utf8");
    if (bytes > MAX_FILE_BYTES) fail("AFRI_ARTIFACT_CHANGE_SIZE_INVALID");
    totalBytes += bytes;
    if (totalBytes > MAX_TOTAL_BYTES) fail("AFRI_ARTIFACT_CHANGE_TOTAL_SIZE_INVALID");

    return Object.freeze({
      path,
      operation,
      contentSha256: createHash("sha256").update(content, "utf8").digest("hex")
    });
  });

  return Object.freeze({
    summary: proposal.summary,
    changes: Object.freeze(changes)
  });
}

function fingerprint(snapshot) {
  return createHash("sha256")
    .update(JSON.stringify(snapshot), "utf8")
    .digest("hex");
}

export class AfriAgentArtifactApprovalAuthority {
  constructor({
    repository,
    artifactRepository,
    authorizeApprover,
    sessionService,
    clock = Date.now,
    ttlMs = 900000
  } = {}) {
    assertRepository(repository);
    if (
      !artifactRepository ||
      typeof artifactRepository.getArtifact !== "function" ||
      typeof artifactRepository.getVersion !== "function"
    ) fail("AFRI_ARTIFACT_REPOSITORY_REQUIRED");
    const authorizer = authorizeApprover ??
      (sessionService ? createAfriAgentApprovalAuthorizer({ sessionService }) : null);
    if (typeof authorizer !== "function") fail("AFRI_ARTIFACT_APPROVAL_AUTHORIZER_REQUIRED");
    if (typeof clock !== "function") fail("AFRI_ARTIFACT_APPROVAL_CLOCK_INVALID");
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 1000) fail("AFRI_ARTIFACT_APPROVAL_TTL_INVALID");

    this.repository = repository;
    this.artifactRepository = artifactRepository;
    this.authorizeApprover = authorizer;
    this.clock = clock;
    this.ttlMs = ttlMs;
  }

  async resolveArtifact({ artifactId, artifactVersion, sourceAgentId, requestedBy }) {
    const id = requiredId(artifactId, "AFRI_ARTIFACT_ID_REQUIRED");
    const source = requiredId(sourceAgentId, "AFRI_ARTIFACT_APPROVAL_SOURCE_REQUIRED");
    const requester = requiredId(requestedBy, "AFRI_ARTIFACT_APPROVAL_REQUESTER_REQUIRED");
    if (!Number.isSafeInteger(artifactVersion) || artifactVersion < 1) {
      fail("AFRI_ARTIFACT_VERSION_INVALID");
    }

    const artifact = await this.artifactRepository.getArtifact(id);
    if (!artifact) fail("AFRI_ARTIFACT_NOT_FOUND");
    if (
      artifact.ownerId !== "AGENT-AFRIAICODER-001" ||
      artifact.artifactType !== "CODE_CHANGE_PROPOSAL"
    ) fail("AFRI_ARTIFACT_APPROVAL_TYPE_FORBIDDEN");

    const version = await this.artifactRepository.getVersion(id, artifactVersion);
    if (!version) fail("AFRI_ARTIFACT_VERSION_NOT_FOUND");
    const proposal = parseProposal(version);

    const snapshot = Object.freeze({
      artifactId: id,
      artifactVersion,
      checksumSha256: version.checksumSha256,
      sizeBytes: version.sizeBytes,
      ownerId: artifact.ownerId,
      workspaceId: artifact.workspaceId,
      repositoryId: artifact.repositoryId,
      artifactType: artifact.artifactType,
      sourceAgentId: source,
      requestedBy: requester,
      targetAgentId: "AGENT-AFRIAICODER-001",
      capability: "engineering.backend",
      executionChannel: "INTERNAL_ADMIN",
      paymentPolicy: "NO_AUTOMATIC_PAYMENT",
      summary: proposal.summary,
      changes: proposal.changes
    });

    return Object.freeze({
      artifactId: id,
      artifactVersion,
      artifactFingerprint: fingerprint(snapshot),
      snapshot
    });
  }

  async request({
    artifactId,
    artifactVersion,
    sourceAgentId = "AGENT-AFRIAICOMMAND-001",
    requestedBy
  } = {}) {
    const resolved = await this.resolveArtifact({
      artifactId, artifactVersion, sourceAgentId, requestedBy
    });
    const now = this.clock();
    const record = {
      approvalId: randomUUID(),
      artifactId: resolved.artifactId,
      artifactVersion: resolved.artifactVersion,
      artifactFingerprint: resolved.artifactFingerprint,
      sourceAgentId: requiredId(sourceAgentId, "AFRI_ARTIFACT_APPROVAL_SOURCE_REQUIRED"),
      requestedBy: requiredId(requestedBy, "AFRI_ARTIFACT_APPROVAL_REQUESTER_REQUIRED"),
      status: "PENDING",
      createdAt: now,
      expiresAt: now + this.ttlMs,
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null,
      consumedAt: null
    };
    await this.repository.create(record);
    return Object.freeze({ ...record, proposal: resolved.snapshot });
  }

  async approve({ approvalId, approverId, principal } = {}) {
    const id = requiredId(approvalId, "AFRI_ARTIFACT_APPROVAL_ID_REQUIRED");
    const approver = requiredId(approverId, "AFRI_ARTIFACT_APPROVER_REQUIRED");
    if (!principal || typeof principal !== "object") fail("AFRI_ARTIFACT_APPROVAL_PRINCIPAL_REQUIRED");

    const record = await this.repository.get(id);
    if (!record) fail("AFRI_ARTIFACT_APPROVAL_NOT_FOUND");
    if (record.status !== "PENDING") fail("AFRI_ARTIFACT_APPROVAL_NOT_PENDING");
    if (record.expiresAt <= this.clock()) fail("AFRI_ARTIFACT_APPROVAL_EXPIRED");
    if (approver === record.requestedBy) fail("AFRI_ARTIFACT_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED");

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
    if (!authorized) fail("AFRI_ARTIFACT_APPROVER_FORBIDDEN");

    const updated = await this.repository.approvePending(id, {
      approvedBy: approver,
      approvedAt: this.clock()
    });
    if (!updated) fail("AFRI_ARTIFACT_APPROVAL_NOT_PENDING");
    return Object.freeze({ ...updated });
  }

  async reject({ approvalId, approverId, principal, reason = null } = {}) {
    const id = requiredId(approvalId, "AFRI_ARTIFACT_APPROVAL_ID_REQUIRED");
    const approver = requiredId(approverId, "AFRI_ARTIFACT_APPROVER_REQUIRED");
    if (!principal || typeof principal !== "object") fail("AFRI_ARTIFACT_APPROVAL_PRINCIPAL_REQUIRED");

    const record = await this.repository.get(id);
    if (!record) fail("AFRI_ARTIFACT_APPROVAL_NOT_FOUND");
    if (record.status !== "PENDING") fail("AFRI_ARTIFACT_APPROVAL_NOT_PENDING");
    if (record.expiresAt <= this.clock()) fail("AFRI_ARTIFACT_APPROVAL_EXPIRED");
    if (approver === record.requestedBy) fail("AFRI_ARTIFACT_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED");

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
    if (!authorized) fail("AFRI_ARTIFACT_APPROVER_FORBIDDEN");
    if (reason !== null && (typeof reason !== "string" || reason.length > MAX_REASON)) {
      fail("AFRI_ARTIFACT_APPROVAL_REASON_INVALID");
    }

    const updated = await this.repository.rejectPending(id, {
      rejectedBy: approver,
      rejectedAt: this.clock(),
      rejectionReason: reason
    });
    if (!updated) fail("AFRI_ARTIFACT_APPROVAL_NOT_PENDING");
    return Object.freeze({ ...updated });
  }

  async consume({
    approvalId,
    artifactId,
    artifactVersion,
    sourceAgentId = "AGENT-AFRIAICOMMAND-001",
    requesterId
  } = {}) {
    const id = requiredId(approvalId, "AFRI_ARTIFACT_APPROVAL_ID_REQUIRED");
    const requester = requiredId(requesterId, "AFRI_ARTIFACT_APPROVAL_REQUESTER_REQUIRED");
    const source = requiredId(sourceAgentId, "AFRI_ARTIFACT_APPROVAL_SOURCE_REQUIRED");
    const record = await this.repository.get(id);
    if (!record) fail("AFRI_ARTIFACT_APPROVAL_NOT_FOUND");
    if (record.status !== "APPROVED") fail("AFRI_ARTIFACT_APPROVAL_NOT_APPROVED");
    if (record.expiresAt <= this.clock()) fail("AFRI_ARTIFACT_APPROVAL_EXPIRED");

    const resolved = await this.resolveArtifact({
      artifactId: artifactId ?? record.artifactId,
      artifactVersion: artifactVersion ?? record.artifactVersion,
      sourceAgentId: source,
      requestedBy: requester
    });
    if (
      resolved.artifactId !== record.artifactId ||
      resolved.artifactVersion !== record.artifactVersion ||
      resolved.artifactFingerprint !== record.artifactFingerprint ||
      source !== record.sourceAgentId ||
      requester !== record.requestedBy
    ) fail("AFRI_ARTIFACT_APPROVAL_SCOPE_MISMATCH");

    const consumed = await this.repository.consumeApproved({
      approvalId: id,
      artifactId: resolved.artifactId,
      artifactVersion: resolved.artifactVersion,
      artifactFingerprint: resolved.artifactFingerprint,
      sourceAgentId: source,
      requesterId: requester,
      consumedAt: this.clock()
    });
    if (!consumed) fail("AFRI_ARTIFACT_APPROVAL_INVALID_OR_ALREADY_CONSUMED");
    return Object.freeze({
      approval: consumed,
      artifact: resolved.snapshot
    });
  }
}

export default AfriAgentArtifactApprovalAuthority;
