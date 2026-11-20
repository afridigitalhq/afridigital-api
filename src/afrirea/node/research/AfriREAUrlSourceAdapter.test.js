import test from "node:test";
import assert from "node:assert/strict";
import { createAfriREAUrlSourceAdapter } from "./AfriREAUrlSourceAdapter.js";

const source = { type: "URL", url: "https://example.com/docs" };

test("fetches and analyzes a URL through injected secure transport", async () => {
  let inspected;
  const adapter = createAfriREAUrlSourceAdapter({
    async fetchPage(url) {
      assert.equal(url, source.url);
      return {
        ok: true,
        url,
        content_type: "text/html",
        bytes: 18,
        body: Buffer.from("<title>Example</title>")
      };
    },
    inspectHtml(...args) {
      inspected = args;
      return { title: "Example", headings: [], textExcerpt: "Example" };
    }
  });

  const result = await adapter.process(source);

  assert.equal(inspected[0], source.url);
  assert.equal(inspected[1], "<title>Example</title>");
  assert.equal(inspected[2], 200);
  assert.equal(result.findings[0].analysis.title, "Example");
  assert.equal(result.evidence[0].locator, source.url);
  assert.equal(result.evidence[0].extractionMethod, "STATIC_HTML_ANALYSIS");
  assert.equal(result.limitations[0].code, "STATIC_HTML_ONLY");
});

test("fails closed when secure URL fetching fails", async () => {
  const adapter = createAfriREAUrlSourceAdapter({
    async fetchPage() {
      return { ok: false, reason: "ROBOTS_FETCH_FAILED" };
    }
  });

  await assert.rejects(
    adapter.process(source),
    error => error.message === "AFRIREA_URL_FETCH_FAILED"
  );
});

test("rejects invalid URL source envelopes", async () => {
  const adapter = createAfriREAUrlSourceAdapter();

  await assert.rejects(
    adapter.process({ type: "URL", url: "" }),
    error => error.message === "AFRIREA_URL_SOURCE_INVALID"
  );
});

test("rejects invalid transport responses", async () => {
  const adapter = createAfriREAUrlSourceAdapter({
    async fetchPage() {
      return { ok: true, url: source.url, body: "<html></html>" };
    }
  });

  await assert.rejects(
    adapter.process(source),
    error => error.message === "AFRIREA_URL_RESPONSE_INVALID"
  );
});

test("sanitizes HTML auditor failures", async () => {
  const adapter = createAfriREAUrlSourceAdapter({
    async fetchPage() {
      return { ok: true, url: source.url, body: Buffer.from("<html></html>") };
    },
    inspectHtml() {
      throw new Error("/private/internal/path");
    }
  });

  await assert.rejects(
    adapter.process(source),
    error => error.message === "AFRIREA_URL_ANALYSIS_FAILED"
  );
});
