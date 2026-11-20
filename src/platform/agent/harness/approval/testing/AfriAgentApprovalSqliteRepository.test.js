import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AfriAgentApprovalAuthority } from "../AfriAgentApprovalAuthority.js";
import { AfriAgentApprovalSqliteRepository } from "./AfriAgentApprovalSqliteRepository.js";

const makeRecord = (approvalId = "approval-sqlite-1") => ({
  approvalId,
  sourceAgentId: "AGENT-AFRIAICOMMAND-001",
  requestedBy: "USER-1",
  planFingerprint: "a".repeat(64),
  status: "PENDING",
  createdAt: 10000,
  expiresAt: 15000,
  approvedBy: null,
  approvedAt: null,
  rejectedBy: null,
  rejectedAt: null,
  rejectionReason: null,
  consumedAt: null
});

function temporaryDatabase(t) {
  const directory = mkdtempSync(join(tmpdir(), "afri-approval-sqlite-"));
  const filename = join(directory, "approvals.sqlite");
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return filename;
}

test("SQLite repository persists approval state after closing and reopening", async t => {
  const filename = temporaryDatabase(t);
  const first = new AfriAgentApprovalSqliteRepository({ filename });

  const created = await first.create(makeRecord());
  assert.equal(created.status, "PENDING");

  const approved = await first.approvePending("approval-sqlite-1", {
    approvedBy: "ADMIN-1",
    approvedAt: 11000
  });
  assert.equal(approved.status, "APPROVED");
  first.close();

  const reopened = new AfriAgentApprovalSqliteRepository({ filename });
  t.after(() => reopened.close());

  const persisted = await reopened.get("approval-sqlite-1");
  assert.equal(persisted.status, "APPROVED");
  assert.equal(persisted.approvedBy, "ADMIN-1");
  assert.equal(persisted.approvedAt, 11000);
});

test("SQLite repository permits only one atomic approval consumption", async t => {
  const filename = temporaryDatabase(t);
  const first = new AfriAgentApprovalSqliteRepository({ filename });
  const second = new AfriAgentApprovalSqliteRepository({ filename });
  t.after(() => first.close());
  t.after(() => second.close());

  await first.create(makeRecord());
  await first.approvePending("approval-sqlite-1", {
    approvedBy: "ADMIN-1",
    approvedAt: 11000
  });

  const request = {
    approvalId: "approval-sqlite-1",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requesterId: "USER-1",
    planFingerprint: "a".repeat(64),
    consumedAt: 12000
  };

  const results = await Promise.all([
    first.consumeApproved(request),
    second.consumeApproved(request)
  ]);

  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(results.filter(result => result?.status === "CONSUMED").length, 1);

  const persisted = await first.get("approval-sqlite-1");
  assert.equal(persisted.status, "CONSUMED");
  assert.equal(persisted.consumedAt, 12000);
});

test("SQLite repository rejects wrong source, fingerprint and expired consumption", async t => {
  const repository = new AfriAgentApprovalSqliteRepository();
  t.after(() => repository.close());

  await repository.create(makeRecord());
  await repository.approvePending("approval-sqlite-1", {
    approvedBy: "ADMIN-1",
    approvedAt: 11000
  });

  const base = {
    approvalId: "approval-sqlite-1",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requesterId: "USER-1",
    planFingerprint: "a".repeat(64),
    consumedAt: 12000
  };

  assert.equal(await repository.consumeApproved({
    ...base,
    sourceAgentId: "AGENT-OTHER-001"
  }), null);

  assert.equal(await repository.consumeApproved({
    ...base,
    planFingerprint: "b".repeat(64)
  }), null);

  assert.equal(await repository.consumeApproved({
    ...base,
    consumedAt: 15000
  }), null);

  assert.equal((await repository.get(base.approvalId)).status, "APPROVED");
});

test("approval authority works with the SQLite repository", async t => {
  const repository = new AfriAgentApprovalSqliteRepository();
  t.after(() => repository.close());

  let now = 10000;
  const authority = new AfriAgentApprovalAuthority({
    repository,
    authorizeApprover: async ({ approverId }) => approverId === "ADMIN-1",
    clock: () => now,
    ttlMs: 5000
  });

  const plan = {
    status: "PREVIEW",
    planningMode: "AI_STRUCTURED",
    requiresApprovalBeforeDelegation: true,
    executionStarted: false,
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    objective: "Research a public website",
    summary: "Inspect the supplied public website",
    steps: [{
      step: 1,
      agentId: "AGENT-AFRIREA-001",
      capability: "research.analyze",
      task: "Analyze https://example.com",
      dependsOn: []
    }]
  };

  const requested = await authority.request({
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requestedBy: "USER-1",
    plan
  });

  await assert.rejects(
    authority.approve({
      approvalId: requested.approvalId,
      approverId: "USER-1",
      principal: { userId: "USER-1" }
    }),
    { message: "AFRI_APPROVAL_SEPARATION_OF_DUTIES_REQUIRED" }
  );

  await authority.approve({
    approvalId: requested.approvalId,
    approverId: "ADMIN-1",
    principal: { userId: "ADMIN-1" }
  });

  now = 12000;
  const consumed = await authority.consume({
    approvalId: requested.approvalId,
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    requesterId: "USER-1",
    plan
  });

  assert.equal(consumed.status, "CONSUMED");

  await assert.rejects(
    authority.consume({
      approvalId: requested.approvalId,
      sourceAgentId: "AGENT-AFRIAICOMMAND-001",
      requesterId: "USER-1",
      plan
    }),
    { message: "AFRI_APPROVAL_INVALID_OR_ALREADY_CONSUMED" }
  );
});
