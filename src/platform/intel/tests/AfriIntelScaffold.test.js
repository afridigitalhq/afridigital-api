import test from "node:test";
import assert from "node:assert/strict";
import Planner from "../AfriIntelQueryPlanner.js";
import SearchEngine from "../AfriIntelSearchEngine.js";
import Correlation from "../AfriIntelCorrelationEngine.js";
import Report from "../AfriIntelReportService.js";

test("plans bounded queries and defaults to web", () => {
  assert.deepEqual(Planner.plan({ query: "AfriDigital" }), {
    query: "AfriDigital",
    sources: ["WEB"],
    limit: 10
  });
});

test("rejects invalid query, source and limit", () => {
  assert.throws(() => Planner.plan({}), { message: "AFRI_INTEL_QUERY_REQUIRED" });
  assert.throws(() => Planner.plan({ query: "x", sources: ["PRIVATE"] }), {
    message: "AFRI_INTEL_SOURCE_UNSUPPORTED"
  });
  assert.throws(() => Planner.plan({ query: "x", limit: 100 }), {
    message: "AFRI_INTEL_LIMIT_INVALID"
  });
});

test("does not claim search is available without adapters", async () => {
  await assert.rejects(SearchEngine.search({ query: "AfriDigital" }), {
    message: "AFRI_INTEL_NO_SEARCH_ADAPTERS"
  });
});

test("uses injected adapters and preserves evidence provenance", async () => {
  const result = await SearchEngine.search(
    { query: "AfriDigital", sources: ["WEB"] },
    { adapters: [{
      id: "test-web",
      supports: source => source === "WEB",
      search: async () => [{
        url: "https://example.com/article",
        title: "Example result",
        snippet: "Public evidence"
      }]
    }] }
  );

  assert.equal(result.evidence.length, 1);
  assert.equal(result.evidence[0].sourceId, "test-web");
  assert.equal(result.evidence[0].provenance.adapterId, "test-web");
});

test("rejects non-HTTP evidence URLs", async () => {
  await assert.rejects(SearchEngine.search(
    { query: "test" },
    { adapters: [{
      id: "unsafe",
      supports: () => true,
      search: async () => [{ url: "file:///etc/passwd", title: "Unsafe" }]
    }] }
  ), { message: "AFRI_INTEL_EVIDENCE_URL_INVALID" });
});

test("correlates repeated canonical URLs", () => {
  const result = Correlation.correlate([
    { url: "https://example.com/a#one", sourceId: "one" },
    { url: "https://example.com/a#two", sourceId: "two" }
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].occurrences, 2);
  assert.deepEqual(result[0].sourceIds, ["one", "two"]);
});

test("creates a structured research report", () => {
  const report = Report.create({
    query: "AfriDigital",
    evidence: [{ title: "Example" }],
    correlations: []
  });
  assert.equal(report.reportType, "AFRI_INTEL_RESEARCH");
  assert.equal(report.evidenceCount, 1);
});
