import { createHash, timingSafeEqual } from "node:crypto";

export const AFRI_ARTIFACT_MAX_BYTES = 131072;

export function calculateAfriAgentArtifactHash(content) {
  if (!Buffer.isBuffer(content) && !(content instanceof Uint8Array)) {
    throw new TypeError("AFRI_ARTIFACT_CONTENT_INVALID");
  }
  if (content.byteLength < 1 || content.byteLength > AFRI_ARTIFACT_MAX_BYTES) {
    throw new RangeError("AFRI_ARTIFACT_CONTENT_SIZE_INVALID");
  }
  return createHash("sha256").update(content).digest("hex");
}

export function verifyAfriAgentArtifactHash(content, expectedHash) {
  if (typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/i.test(expectedHash)) {
    throw new TypeError("AFRI_ARTIFACT_HASH_INVALID");
  }
  const actual = Buffer.from(calculateAfriAgentArtifactHash(content), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return timingSafeEqual(actual, expected);
}
