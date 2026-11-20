import test from "node:test";
import assert from "node:assert/strict";
import AfriREASourceAdapterRegistry from "./AfriREASourceAdapterRegistry.js";
import AfriREAResearchCoordinator from "./AfriREAResearchCoordinator.js";

const request = {
  objective: "Research architectural design references",
  domain: "architecture",
  sources: [
    {
      sourceId: "URL-1",
      type: "URL",
      origin: "PUBLIC_URL",
      url: "https://example.com/docs"
    },
    {
      sourceId: "IMAGE-1",
      type: "SCREENSHOT",
      origin: "USER_UPLOAD",
      fileId: "image-reference-1"
    }
  ]
};

test("registers and resolves source adapters", () => {
  const registry = new AfriREASourceAdapterRegistry();
  const adapter = { process: async () => ({}) };

  registry.register("URL", adapter);

  assert.equal(registry.resolve("URL"), adapter);
  assert.equal(registry.has("URL"), true);
  assert.deepEqual(registry.list(), ["URL"]);
});

test("rejects invalid and duplicate adapter registrations", () => {
  const registry = new AfriREASourceAdapterRegistry();

  assert.throws(
    () => registry.register("UNKNOWN", { process: async () => ({}) }),
    { message: "AFRIREA_SOURCE_ADAPTER_TYPE_INVALID" }
  );

  assert.throws(
    () => registry.register("URL", {}),
    { message: "AFRIREA_SOURCE_ADAPTER_INVALID" }
  );

  registry.register("URL", { process: async () => ({}) });

  assert.throws(
    () => registry.register("URL", { process: async () => ({}) }),
    { message: "AFRIREA_SOURCE_ADAPTER_DUPLICATE" }
  );
});

test("processes multiple sources and combines evidence", async () => {
  const registry = new AfriREASourceAdapterRegistry();

  registry.register("URL", {
    async process(source, context) {
      assert.equal(context.domain, "architecture");
      return {
        findings: [{ title: "Reference documentation found" }],
        evidence: [{ locator: source.url }]
      };
    }
  });

  registry.register("SCREENSHOT", {
    async process(source) {
      return {
        findings: [{ title: "Uploaded drawing received" }],
        evidence: [{ artifactRef: source.fileId }]
      };
    }
  });

  const coordinator = new AfriREAResearchCoordinator({
    adapterRegistry: registry,
    createResearchId: () => "RESEARCH-TEST-001"
  });

  const result = await coordinator.run(request);

  assert.equal(result.status, "COMPLETED");
  assert.equal(result.researchId, "RESEARCH-TEST-001");
  assert.equal(result.sources.length, 2);
  assert.equal(result.findings.length, 2);
  assert.equal(result.evidence.length, 2);
  assert.equal(result.findings[1].sourceId, "IMAGE-1");
});

test("continues processing when one source fails", async () => {
  const registry = new AfriREASourceAdapterRegistry();

  registry.register("URL", {
    async process() {
      throw new Error("AFRIREA_TEST_SOURCE_FAILURE");
    }
  });

  registry.register("SCREENSHOT", {
    async process() {
      return { findings: [{ title: "Image reference accepted" }] };
    }
  });

  const result = await new AfriREAResearchCoordinator({
    adapterRegistry: registry
  }).run(request);

  assert.equal(result.status, "PARTIAL");
  assert.equal(result.sources[0].status, "FAILED");
  assert.equal(result.sources[1].status, "COMPLETED");
  assert.equal(result.findings.length, 1);
});

test("reports unsupported source types without stopping research", async () => {
  const registry = new AfriREASourceAdapterRegistry();

  registry.register("URL", {
    async process() {
      return { findings: [{ title: "URL processed" }] };
    }
  });

  const result = await new AfriREAResearchCoordinator({
    adapterRegistry: registry
  }).run(request);

  assert.equal(result.status, "PARTIAL");
  assert.equal(result.sources[1].status, "UNSUPPORTED");
  assert.equal(
    result.sources[1].errorCode,
    "AFRIREA_SOURCE_ADAPTER_UNAVAILABLE"
  );
});

test("does not expose arbitrary adapter exception messages", async () => {
  const registry = new AfriREASourceAdapterRegistry();

  registry.register("URL", {
    async process() {
      throw new Error("private storage path /secret/data");
    }
  });

  const result = await new AfriREAResearchCoordinator({
    adapterRegistry: registry
  }).run({
    ...request,
    sources: [request.sources[0]]
  });

  assert.equal(
    result.sources[0].errorCode,
    "AFRIREA_SOURCE_PROCESSING_FAILED"
  );
  assert.equal(JSON.stringify(result).includes("/secret/data"), false);
});

test("rejects malformed adapter results", async () => {
  const registry = new AfriREASourceAdapterRegistry();

  registry.register("URL", {
    async process() {
      return { findings: "not-an-array" };
    }
  });

  const result = await new AfriREAResearchCoordinator({
    adapterRegistry: registry
  }).run({
    ...request,
    sources: [request.sources[0]]
  });

  assert.equal(result.status, "FAILED");
  assert.equal(
    result.sources[0].errorCode,
    "AFRIREA_ADAPTER_RESULT_INVALID"
  );
});

test("rejects non-JSON adapter values", async () => {
  const registry = new AfriREASourceAdapterRegistry();
  registry.register("URL", { async process() { return { findings: [{ nested: { callback: () => true } }] }; } });
  const result = await new AfriREAResearchCoordinator({ adapterRegistry: registry }).run({ ...request, sources: [request.sources[0]] });
  assert.equal(result.sources[0].status, "FAILED");
  assert.equal(result.sources[0].errorCode, "AFRIREA_ADAPTER_RESULT_INVALID");
});

test("rejects oversized adapter items", async () => {
  const registry = new AfriREASourceAdapterRegistry();
  registry.register("URL", { async process() { return { findings: [{ content: "x".repeat(70 * 1024) }] }; } });
  const result = await new AfriREAResearchCoordinator({ adapterRegistry: registry }).run({ ...request, sources: [request.sources[0]] });
  assert.equal(result.sources[0].status, "FAILED");
  assert.equal(result.sources[0].errorCode, "AFRIREA_ADAPTER_RESULT_INVALID");
});

test("bounds aggregate research output and preserves earlier source results", async () => {
  const registry = new AfriREASourceAdapterRegistry();
  registry.register("URL", { async process() { return { findings: Array.from({ length: 10 }, () => ({ content: "x".repeat(5000) })) }; } });
  const sources = Array.from({ length: 30 }, (_, index) => ({ sourceId: "SRC-" + index, type: "URL", origin: "PUBLIC_URL", url: "https://example.com/" + index }));
  const result = await new AfriREAResearchCoordinator({ adapterRegistry: registry }).run({ ...request, sources });
  assert.equal(result.status, "PARTIAL");
  assert.ok(result.sources.some(source => source.status === "FAILED" && source.errorCode === "AFRIREA_RESEARCH_RESULT_LIMIT_EXCEEDED"));
  assert.ok(result.findings.length > 0);
  assert.ok(result.findings.every(item => typeof item.sourceId === "string"));
  assert.ok(Buffer.byteLength(JSON.stringify(result), "utf8") < 1024 * 1024 + 10000);
});
