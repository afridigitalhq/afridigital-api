import test from "node:test";
import assert from "node:assert/strict";
import { AfriAgentArtifactApprovalAuthority } from "../AfriAgentArtifactApprovalAuthority.js";
import { calculateAfriAgentArtifactHash } from "../AfriAgentArtifactIntegrity.js";

const content = () => Buffer.from(JSON.stringify({
  status: "PATCH_PROPOSAL_READY",
  summary: "Add a backend health endpoint",
  changes: [{ path: "src/api/health.js", operation: "create", content: "export default true;\n" }]
}));

function setup({ authorize = async () => true, ttlMs = 5000, proposal = content() } = {}) {
  let now = 10000;
  const records = new Map();
  const artifactContent = Buffer.from(proposal);
  const artifactChecksum = calculateAfriAgentArtifactHash(artifactContent);
  const artifactRepository = {
    async getArtifact(id) {
      return id === "ART-1" ? {
        artifactId: id,
        ownerId: "AGENT-AFRIAICODER-001",
        workspaceId: "WORKSPACE-1",
        repositoryId: "afridigital-api",
        artifactType: "CODE_CHANGE_PROPOSAL"
      } : null;
    },
    async getVersion(id, version) {
      if (id !== "ART-1" || version !== 1) return null;
      return {
        artifactId: id,
        version,
        content: Buffer.from(artifactContent),
        sizeBytes: artifactContent.length,
        checksumSha256: artifactChecksum
      };
    }
  };
  const repository = {
    async create(record) {
      if (records.has(record.approvalId)) throw new Error("DUPLICATE");
      records.set(record.approvalId, { ...record });
    },
    async get(id) {
      const record = records.get(id);
      return record ? { ...record } : null;
    },
    async approvePending(id, patch) {
      const record = records.get(id);
      if (!record || record.status !== "PENDING" || record.expiresAt <= patch.approvedAt) return null;
      Object.assign(record, patch, { status: "APPROVED" });
      return { ...record };
    },
    async rejectPending(id, patch) {
      const record = records.get(id);
      if (!record || record.status !== "PENDING" || record.expiresAt <= patch.rejectedAt) return null;
      Object.assign(record, patch, { status: "REJECTED" });
      return { ...record };
    },
    async consumeApproved(input) {
      const record = records.get(input.approvalId);
      if (
        !record || record.status !== "APPROVED" ||
        record.artifactId !== input.artifactId ||
        record.artifactVersion !== input.artifactVersion ||
        record.artifactFingerprint !== input.artifactFingerprint ||
        record.sourceAgentId !== input.sourceAgentId ||
        record.requestedBy !== input.requesterId ||
        record.expiresAt <= input.consumedAt
      ) return null;
      Object.assign(record, { status: "CONSUMED", consumedAt: input.consumedAt });
      return { ...record };
    }
  };
  const authority = new AfriAgentArtifactApprovalAuthority({
    repository, artifactRepository, authorizeApprover: authorize,
    clock: () => now, ttlMs
  });
  return {
    authority,
    records,
    setNow(value) { now = value; },
    tamper() { artifactContent[0] ^= 1; }
  };
}

async function requestAndApprove(authority) {
  const pending = await authority.request({
    artifactId: "ART-1",
    artifactVersion: 1,
    requestedBy: "USER-1"
  });
  const approved = await authority.approve({
    approvalId: pending.approvalId,
    approverId: "USER-2",
    principal: { token: "verified-by-test-authorizer" }
  });
  return { pending, approved };
}

test("binds Approval B to the exact proposal and returns its file scope", async () => {
  const { authority } = setup();
  const { pending, approved } = await requestAndApprove(authority);
  assert.equal(approved.status, "APPROVED");
  assert.equal(pending.proposal.changes[0].path, "src/api/health.js");
  assert.match(pending.artifactFingerprint, /^[a-f0-9]{64}$/);
});

test("requires an independent authorized approver", async () => {
  const { authority } = setup({ authorize: async () => false });
  const pending = await authority.request({
    artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1"
  });
  await assert.rejects(
    authority.approve({
      approvalId: pending.approvalId,
      approverId: "USER-1",
      principal: {}
    }),
    { code: "AFRI_ARTIFACT_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED" }
  );
  await assert.rejects(
    authority.approve({
      approvalId: pending.approvalId,
      approverId: "USER-2",
      principal: {}
    }),
    { code: "AFRI_ARTIFACT_APPROVER_FORBIDDEN" }
  );
});

test("consumes an approved artifact exactly once", async () => {
  const { authority } = setup();
  const { pending } = await requestAndApprove(authority);
  const result = await authority.consume({
    approvalId: pending.approvalId,
    requesterId: "USER-1"
  });
  assert.equal(result.approval.status, "CONSUMED");
  await assert.rejects(
    authority.consume({ approvalId: pending.approvalId, requesterId: "USER-1" }),
    { code: "AFRI_ARTIFACT_APPROVAL_NOT_APPROVED" }
  );
});

test("rejects tampered artifact content before consumption", async () => {
  const state = setup();
  const { pending } = await requestAndApprove(state.authority);
  state.tamper();
  await assert.rejects(
    state.authority.consume({ approvalId: pending.approvalId, requesterId: "USER-1" }),
    { code: "AFRI_ARTIFACT_INTEGRITY_FAILURE" }
  );
  assert.equal(state.records.get(pending.approvalId).status, "APPROVED");
});

test("rejects a changed artifact scope at consumption", async () => {
  const { authority } = setup();
  const { pending } = await requestAndApprove(authority);
  await assert.rejects(
    authority.consume({
      approvalId: pending.approvalId,
      artifactId: "ART-OTHER",
      requesterId: "USER-1"
    }),
    { code: "AFRI_ARTIFACT_NOT_FOUND" }
  );
});

test("rejects expired approvals", async () => {
  const state = setup({ ttlMs: 1000 });
  const pending = await state.authority.request({
    artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1"
  });
  state.setNow(12000);
  await assert.rejects(
    state.authority.approve({
      approvalId: pending.approvalId,
      approverId: "USER-2",
      principal: {}
    }),
    { code: "AFRI_ARTIFACT_APPROVAL_EXPIRED" }
  );
});

test("rejects unsafe paths, duplicate paths and unsupported operations", async () => {
  const invalidPaths = [
    "../secrets.txt", ".git/config", ".env", "src/.env.local",
    "C:/Windows/system.ini", "src/token-secret.js",
    "src/credentials.json", "certs/server.pem", "src/private-key.js"
  ];
  for (const path of invalidPaths) {
    const proposal = JSON.stringify({
      status: "PATCH_PROPOSAL_READY",
      summary: "Invalid path test",
      changes: [{ path, operation: "create", content: "x" }]
    });
    const { authority } = setup({ proposal });
    await assert.rejects(
      authority.request({ artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1" }),
      { code: "AFRI_ARTIFACT_CHANGE_PATH_INVALID" },
      path
    );
  }
  const duplicate = JSON.stringify({
    status: "PATCH_PROPOSAL_READY",
    summary: "Duplicate path test",
    changes: [
      { path: "src/a.js", operation: "create", content: "a" },
      { path: "src/a.js", operation: "modify", content: "b" }
    ]
  });
  await assert.rejects(
    setup({ proposal: duplicate }).authority.request({
      artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1"
    }),
    { code: "AFRI_ARTIFACT_CHANGE_PATH_DUPLICATE" }
  );
  const unsupported = JSON.stringify({
    status: "PATCH_PROPOSAL_READY",
    summary: "Unsupported operation test",
    changes: [{ path: "src/a.js", operation: "delete", content: "x" }]
  });
  await assert.rejects(
    setup({ proposal: unsupported }).authority.request({
      artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1"
    }),
    { code: "AFRI_ARTIFACT_CHANGE_OPERATION_INVALID" }
  );
});


test("rejects unexpected proposal and change fields", async () => {
  const base = { status: "PATCH_PROPOSAL_READY", summary: "Strict schema test", changes: [{ path: "src/a.js", operation: "create", content: "x" }] };
  for (const item of [
    { proposal: { ...base, hiddenExecution: true }, code: "AFRI_ARTIFACT_PROPOSAL_FIELDS_FORBIDDEN" },
    { proposal: { ...base, changes: [{ ...base.changes[0], extra: true }] }, code: "AFRI_ARTIFACT_CHANGE_FIELDS_FORBIDDEN" }
  ]) {
    const { authority } = setup({ proposal: JSON.stringify(item.proposal) });
    await assert.rejects(authority.request({ artifactId: "ART-1", artifactVersion: 1, requestedBy: "USER-1" }), { code: item.code });
  }
});
