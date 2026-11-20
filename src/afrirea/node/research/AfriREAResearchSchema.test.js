import test from "node:test";
import assert from "node:assert/strict";
import { validateAfriREAResearchRequest } from "./AfriREAResearchSchema.js";

const base = {
  objective: "Research CAD automation",
  domain: "architecture",
  sources: [
    { sourceId: "URL-1", type: "URL", origin: "PUBLIC_URL", url: "https://example.com/docs" }
  ]
};

test("accepts multiple research input types in one request", () => {
  const result = validateAfriREAResearchRequest({
    ...base,
    sources: [
      ...base.sources,
      { sourceId: "IMG-1", type: "SCREENSHOT", origin: "USER_UPLOAD", fileId: "upload-1" },
      { sourceId: "PDF-1", type: "DOCUMENT", origin: "USER_UPLOAD", fileId: "upload-2" },
      { sourceId: "REPO-1", type: "REPOSITORY", origin: "PUBLIC_URL", url: "https://github.com/example/project", revision: "abc123" },
      { sourceId: "API-1", type: "API_SPEC", origin: "USER_UPLOAD", fileId: "openapi-1" },
      { sourceId: "APP-1", type: "ANDROID_APP", origin: "USER_UPLOAD", fileId: "apk-1" },
      { sourceId: "VID-1", type: "VIDEO", origin: "USER_UPLOAD", fileId: "video-1" }
    ],
    requirements: ["features", "automation APIs"]
  });
  assert.equal(result.sources.length, 7);
  assert.equal(result.sources[3].revision, "abc123");
  assert.equal(result.domain, "architecture");
  assert.equal(result.outputFormat, "structured_research");
});

test("rejects non-HTTPS URLs", () => {
  assert.throws(() => validateAfriREAResearchRequest({
    ...base,
    sources: [{ ...base.sources[0], url: "http://example.com" }]
  }), { message: "AFRIREA_SOURCE_URL_INVALID" });
});

test("rejects arbitrary paths and raw source content", () => {
  assert.throws(() => validateAfriREAResearchRequest({
    ...base, repositoryPath: "/tmp/repo"
  }), { message: "AFRIREA_RESEARCH_REQUEST_FIELD_FORBIDDEN" });
  assert.throws(() => validateAfriREAResearchRequest({
    ...base,
    sources: [{ ...base.sources[0], path: "/tmp/file" }]
  }), { message: "AFRIREA_SOURCE_FIELD_FORBIDDEN" });
});

test("rejects duplicate IDs and unsafe file references", () => {
  assert.throws(() => validateAfriREAResearchRequest({
    ...base, sources: [base.sources[0], { ...base.sources[0] }]
  }), { message: "AFRIREA_SOURCE_ID_INVALID" });
  assert.throws(() => validateAfriREAResearchRequest({
    ...base,
    sources: [{ sourceId: "IMG-1", type: "SCREENSHOT", origin: "USER_UPLOAD", fileId: "../secret" }]
  }), { message: "AFRIREA_SOURCE_FILE_REFERENCE_INVALID" });
});

test("requires a valid source and bounded requirements", () => {
  assert.throws(() => validateAfriREAResearchRequest({
    ...base, sources: []
  }), { message: "AFRIREA_RESEARCH_SOURCES_INVALID" });
  assert.throws(() => validateAfriREAResearchRequest({
    ...base, requirements: ["x".repeat(201)]
  }), { message: "AFRIREA_RESEARCH_REQUIREMENT_INVALID" });
});
