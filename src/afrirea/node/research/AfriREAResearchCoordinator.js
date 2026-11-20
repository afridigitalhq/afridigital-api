import { randomUUID } from "node:crypto";
import { validateAfriREAResearchRequest } from "./AfriREAResearchSchema.js";

const MAX_ITEMS_PER_ARRAY = 100;
const MAX_ITEM_BYTES = 64 * 1024;
const MAX_ADAPTER_RESULT_BYTES = 256 * 1024;
const MAX_RESEARCH_RESULT_ITEMS = 1000;
const MAX_RESEARCH_RESULT_BYTES = 1024 * 1024;
const MAX_VALUE_DEPTH = 12;

function safeErrorCode(error) {
  const message = error?.message;
  return typeof message === "string" &&
    /^AFRIREA_[A-Z0-9_]{1,100}$/.test(message)
    ? message
    : "AFRIREA_SOURCE_PROCESSING_FAILED";
}

function validateJsonValue(value, depth = 0, seen = new Set()) {
  if (depth > MAX_VALUE_DEPTH) {
    throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
  }

  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;

  if (typeof value !== "object" || seen.has(value)) {
    throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
  }

  seen.add(value);

  if (Array.isArray(value)) {
    if (value.length > MAX_RESEARCH_RESULT_ITEMS) {
      throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
    }
    for (const item of value) validateJsonValue(item, depth + 1, seen);
    seen.delete(value);
    return;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
  }

  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || key === "__proto__" || key === "constructor" || key === "prototype") {
      throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
    }

    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !Object.hasOwn(descriptor, "value") || !descriptor.enumerable) {
      throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
    }

    validateJsonValue(descriptor.value, depth + 1, seen);
  }

  seen.delete(value);
}

function validateAdapterResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
  }

  const prototype = Object.getPrototypeOf(result);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
  }

  const output = { findings: [], evidence: [], limitations: [] };
  let itemCount = 0;
  let serializedBytes = 0;

  for (const key of ["findings", "evidence", "limitations"]) {
    const items = result[key];
    if (items === undefined) continue;
    if (!Array.isArray(items) || items.length > MAX_ITEMS_PER_ARRAY) {
      throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
    }

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
      }

      validateJsonValue(item);
      let serialized;
      try {
        serialized = JSON.stringify(item);
      } catch {
        throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
      }

      const bytes = Buffer.byteLength(serialized, "utf8");
      if (bytes > MAX_ITEM_BYTES) {
        throw new Error("AFRIREA_ADAPTER_RESULT_INVALID");
      }

      serializedBytes += bytes;
      itemCount += 1;
      if (serializedBytes > MAX_ADAPTER_RESULT_BYTES) {
        throw new Error("AFRIREA_ADAPTER_RESULT_LIMIT_EXCEEDED");
      }

      output[key].push(item);
    }
  }

  return { ...output, itemCount, serializedBytes };
}

export class AfriREAResearchCoordinator {
  constructor({ adapterRegistry, createResearchId = randomUUID } = {}) {
    if (!adapterRegistry || typeof adapterRegistry.resolve !== "function") {
      throw new Error("AFRIREA_ADAPTER_REGISTRY_INVALID");
    }
    if (typeof createResearchId !== "function") {
      throw new Error("AFRIREA_RESEARCH_ID_FACTORY_INVALID");
    }

    this.adapterRegistry = adapterRegistry;
    this.createResearchId = createResearchId;
  }

  async run(input, context = {}) {
    const request = validateAfriREAResearchRequest(input);
    const researchId = this.createResearchId();

    if (typeof researchId !== "string" || !researchId.trim()) {
      throw new Error("AFRIREA_RESEARCH_ID_INVALID");
    }

    const sources = [];
    const findings = [];
    const evidence = [];
    const limitations = [];
    let totalResultItems = 0;
    let totalResultBytes = 0;

    for (const source of request.sources) {
      const adapter = this.adapterRegistry.resolve(source.type);

      if (!adapter) {
        sources.push({
          sourceId: source.sourceId,
          type: source.type,
          status: "UNSUPPORTED",
          errorCode: "AFRIREA_SOURCE_ADAPTER_UNAVAILABLE"
        });
        limitations.push({
          sourceId: source.sourceId,
          code: "AFRIREA_SOURCE_ADAPTER_UNAVAILABLE"
        });
        continue;
      }

      try {
        const output = validateAdapterResult(
          await adapter.process(source, {
            researchId,
            objective: request.objective,
            domain: request.domain,
            requirements: request.requirements,
            context
          })
        );

        if (
          totalResultItems + output.itemCount > MAX_RESEARCH_RESULT_ITEMS ||
          totalResultBytes + output.serializedBytes > MAX_RESEARCH_RESULT_BYTES
        ) {
          throw new Error("AFRIREA_RESEARCH_RESULT_LIMIT_EXCEEDED");
        }

        findings.push(...output.findings.map(item => ({
          ...item,
          sourceId: source.sourceId
        })));
        evidence.push(...output.evidence.map(item => ({
          ...item,
          sourceId: source.sourceId
        })));
        limitations.push(...output.limitations.map(item => ({
          ...item,
          sourceId: source.sourceId
        })));

        totalResultItems += output.itemCount;
        totalResultBytes += output.serializedBytes;

        sources.push({
          sourceId: source.sourceId,
          type: source.type,
          status: "COMPLETED",
          findingCount: output.findings.length,
          evidenceCount: output.evidence.length
        });
      } catch (error) {
        const errorCode = safeErrorCode(error);

        sources.push({
          sourceId: source.sourceId,
          type: source.type,
          status: "FAILED",
          errorCode
        });

        limitations.push({
          sourceId: source.sourceId,
          code: errorCode
        });
      }
    }

    const completed = sources.filter(item => item.status === "COMPLETED").length;
    const failed = sources.filter(item =>
      item.status === "FAILED" || item.status === "UNSUPPORTED"
    ).length;
    const status = failed === 0
      ? "COMPLETED"
      : completed > 0
        ? "PARTIAL"
        : "FAILED";

    return {
      service: "AfriREA",
      researchId,
      objective: request.objective,
      domain: request.domain,
      status,
      sources,
      findings,
      evidence,
      limitations
    };
  }
}

export default AfriREAResearchCoordinator;
