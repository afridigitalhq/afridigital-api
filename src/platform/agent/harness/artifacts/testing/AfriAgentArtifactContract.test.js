import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAfriAgentArtifactInput
} from "../AfriAgentArtifactContract.js";
import {
  calculateAfriAgentArtifactHash,
  verifyAfriAgentArtifactHash
} from "../AfriAgentArtifactIntegrity.js";

const valid = () => ({
  ownerId: "AGENT-AFRIAICODER-001",
  workspaceId: "WORKSPACE-001",
  repositoryId: "afridigital-api",
  artifactType: "CODE_CHANGE_PROPOSAL",
  fileName: "proposal.json",
  contentType: "application/json",
  content: Buffer.from('{"status":"PATCH_PROPOSAL_READY"}')
});

test("validates proposal metadata and calculates the actual content hash", () => {
  const input = valid();
  const artifact = validateAfriAgentArtifactInput(input);
  assert.equal(artifact.sizeBytes, input.content.length);
  assert.equal(artifact.checksumSha256, calculateAfriAgentArtifactHash(input.content));
  assert.equal(verifyAfriAgentArtifactHash(input.content, artifact.checksumSha256), true);
  assert.match(artifact.artifactId, /^ART-/);
});

test("does not trust a caller-supplied checksum", () => {
  const artifact = validateAfriAgentArtifactInput({
    ...valid(),
    checksumSha256: "0".repeat(64)
  });
  assert.notEqual(artifact.checksumSha256, "0".repeat(64));
});

test("rejects missing ownership and workspace identity", () => {
  for (const field of ["ownerId", "workspaceId", "repositoryId"]) {
    const input = valid();
    delete input[field];
    assert.throws(() => validateAfriAgentArtifactInput(input));
  }
});

test("rejects path traversal and malformed filenames", () => {
  for (const fileName of ["../proposal.json", "folder/proposal.json", "folder\\proposal.json", ".."]) {
    assert.throws(() => validateAfriAgentArtifactInput({ ...valid(), fileName }));
  }
});

test("rejects invalid content and content beyond the storage limit", () => {
  assert.throws(() => validateAfriAgentArtifactInput({ ...valid(), content: "not bytes" }));
  assert.throws(() => validateAfriAgentArtifactInput({
    ...valid(),
    content: Buffer.alloc(131073)
  }));
});

test("detects content tampering", () => {
  const content = Buffer.from("original");
  const hash = calculateAfriAgentArtifactHash(content);
  assert.equal(verifyAfriAgentArtifactHash(content, hash), true);
  assert.equal(verifyAfriAgentArtifactHash(Buffer.from("tampered"), hash), false);
  assert.throws(() => verifyAfriAgentArtifactHash(content, "invalid"));
});
