import { randomUUID } from "node:crypto";
import { calculateAfriAgentArtifactHash, AFRI_ARTIFACT_MAX_BYTES } from "./AfriAgentArtifactIntegrity.js";

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const TYPE_PATTERN = /^[A-Z][A-Z0-9_]{1,63}$/;

function fail(code) {
  const error = new TypeError(code);
  error.code = code;
  throw error;
}

function requiredText(value, code, max = 128) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) fail(code);
  return value.trim();
}

export function validateAfriAgentArtifactInput(input = {}) {
  if (!input || Object.getPrototypeOf(input) !== Object.prototype) {
    fail("AFRI_ARTIFACT_INPUT_INVALID");
  }

  const ownerId = requiredText(input.ownerId, "AFRI_ARTIFACT_OWNER_INVALID");
  const workspaceId = requiredText(input.workspaceId, "AFRI_ARTIFACT_WORKSPACE_INVALID");
  const repositoryId = requiredText(input.repositoryId, "AFRI_ARTIFACT_REPOSITORY_INVALID");
  const artifactType = requiredText(input.artifactType, "AFRI_ARTIFACT_TYPE_INVALID", 64);
  const fileName = requiredText(input.fileName, "AFRI_ARTIFACT_FILENAME_INVALID", 255);
  const contentType = requiredText(input.contentType, "AFRI_ARTIFACT_CONTENT_TYPE_INVALID", 160);

  if (!ID_PATTERN.test(ownerId) || !ID_PATTERN.test(workspaceId) || !ID_PATTERN.test(repositoryId)) {
    fail("AFRI_ARTIFACT_IDENTITY_INVALID");
  }
  if (!TYPE_PATTERN.test(artifactType)) fail("AFRI_ARTIFACT_TYPE_INVALID");
  if (/[\\/\\x00]/.test(fileName) || fileName === "." || fileName === "..") {
    fail("AFRI_ARTIFACT_FILENAME_INVALID");
  }
  if (!/^[a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+(?:\s*;\s*charset=utf-8)?$/i.test(contentType)) {
    fail("AFRI_ARTIFACT_CONTENT_TYPE_INVALID");
  }
  if (!Buffer.isBuffer(input.content) && !(input.content instanceof Uint8Array)) {
    fail("AFRI_ARTIFACT_CONTENT_INVALID");
  }

  const content = Buffer.from(input.content);
  if (content.length < 1 || content.length > AFRI_ARTIFACT_MAX_BYTES) {
    fail("AFRI_ARTIFACT_CONTENT_SIZE_INVALID");
  }

  const artifactId = input.artifactId ?? `ART-${randomUUID()}`;
  if (typeof artifactId !== "string" || !ID_PATTERN.test(artifactId)) {
    fail("AFRI_ARTIFACT_ID_INVALID");
  }

  return Object.freeze({
    artifactId,
    ownerId,
    workspaceId,
    repositoryId,
    artifactType,
    fileName,
    contentType: contentType.toLowerCase(),
    sizeBytes: content.length,
    checksumSha256: calculateAfriAgentArtifactHash(content),
    content
  });
}
