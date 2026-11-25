import { createHash } from "node:crypto";

const fail = code => { const error = new Error(code); error.code = code; throw error; };

function canonical(value, depth = 0) {
  if (depth > 12) fail("AFRI_RECEIPT_ENVELOPE_DEPTH_INVALID");
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    if (value.length > 100) fail("AFRI_RECEIPT_ENVELOPE_ARRAY_INVALID");
    return value.map(item => canonical(item, depth + 1));
  }
  if (!value || typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) {
    fail("AFRI_RECEIPT_ENVELOPE_VALUE_INVALID");
  }
  const output = {};
  for (const key of Object.keys(value).sort()) {
    if (["__proto__", "constructor", "prototype"].includes(key)) fail("AFRI_RECEIPT_ENVELOPE_KEY_INVALID");
    output[key] = canonical(value[key], depth + 1);
  }
  return output;
}

export function fingerprintAfriAgentExecutionReceipt(envelope) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    fail("AFRI_RECEIPT_ENVELOPE_INVALID");
  }
  const required = [
    "sourceAgentId", "targetAgentId", "capabilityId", "grantId",
    "stepNumber", "taskId", "planObjective", "planSummary",
    "step", "objective", "dependsOn", "dependencyResults",
    "executionChannel", "paymentPolicy"
  ];
  for (const key of required) {
    if (!Object.hasOwn(envelope, key)) fail("AFRI_RECEIPT_ENVELOPE_FIELD_MISSING");
  }
  if (!Number.isSafeInteger(envelope.stepNumber) || envelope.stepNumber < 1 || envelope.stepNumber > 12 ||
      !Array.isArray(envelope.dependsOn) || envelope.dependsOn.length > 12 ||
      !Array.isArray(envelope.dependencyResults) || envelope.dependencyResults.length > 12 ||
      envelope.executionChannel !== "INTERNAL_ADMIN" ||
      envelope.paymentPolicy !== "NO_AUTOMATIC_PAYMENT") {
    fail("AFRI_RECEIPT_ENVELOPE_INVALID");
  }
  const normalized = canonical(envelope);
  const serialized = JSON.stringify(normalized);
  if (Buffer.byteLength(serialized, "utf8") > 32768) fail("AFRI_RECEIPT_ENVELOPE_TOO_LARGE");
  const hash = value => createHash("sha256").update(JSON.stringify(canonical(value)), "utf8").digest("hex");
  return Object.freeze({
    envelope: Object.freeze(normalized),
    envelopeHash: createHash("sha256").update(serialized, "utf8").digest("hex"),
    objectiveHash: hash(envelope.objective),
    dependenciesHash: hash(envelope.dependsOn),
    dependencyResultsHash: hash(envelope.dependencyResults)
  });
}

export default fingerprintAfriAgentExecutionReceipt;
