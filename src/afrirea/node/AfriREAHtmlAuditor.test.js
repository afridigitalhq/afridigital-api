import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { inspectHtml } from "./AfriREAHtmlAuditor.js";

test("preserves schema v2 metadata and SHA-256", () => {
  const html = "<html><head><title>Example</title></head><body><h1>Hello</h1></body></html>";
  const result = inspectHtml("https://example.com", html);
  assert.equal(result.schema_version, 2);
  assert.equal(result.title, "Example");
  assert.equal(result.headings[0].text, "Hello");
  assert.match(result.sha256, /^[a-f0-9]{64}$/);
  assert.equal(result.html_bytes, Buffer.byteLength(html));
});

test("extracts descriptions and decodes common entities", () => {
  const result = inspectHtml("https://example.com", '<meta name="description" content="Fish &amp; Chips"><title>A&nbsp;B</title>');
  assert.equal(result.description, "Fish & Chips");
  assert.equal(result.title, "A B");
});

test("ignores script, style, noscript, svg and template content", () => {
  const result = inspectHtml("https://example.com", '<script><h1>bad</h1></script><style>hidden</style><noscript>no</noscript><svg>svg</svg><template>template</template><h1>Good</h1>');
  assert.equal(result.headings.length, 1);
  assert.equal(result.headings[0].text, "Good");
  assert.equal(result.text_excerpt, "Good");
});

test("extracts and classifies relative, absolute and fragment links", () => {
  const result = inspectHtml("https://example.com/path/page", '<a href="/inside">Inside</a><a href="https://other.example/x">Other</a><a href="#top">Top</a><a href="javascript:alert(1)">Bad</a>');
  assert.equal(result.links.length, 3);
  assert.equal(result.internal_links.length, 2);
  assert.equal(result.external_links.length, 1);
  assert.equal(result.links[0].text, "Inside");
  assert.equal(result.links[1].url, "https://other.example/x");
});

test("extracts forms and associates their fields", () => {
  const result = inspectHtml("https://example.com/base", '<form action="/search" method="POST"><input name="q" placeholder="Search"><textarea aria-label="Details"></textarea><button type="submit">Go</button></form>');
  assert.equal(result.forms.length, 1);
  assert.equal(result.forms[0].action, "https://example.com/search");
  assert.equal(result.forms[0].method, "post");
  assert.equal(result.forms[0].fields.length, 3);
  assert.equal(result.fields[1].aria_label, "Details");
});

test("does not associate fields outside forms", () => {
  const result = inspectHtml("https://example.com", '<input name="outside"><form><input name="inside"></form>');
  assert.equal(result.fields.length, 2);
  assert.equal(result.forms[0].fields.length, 1);
  assert.equal(result.forms[0].fields[0].name, "inside");
});

test("handles malformed tags and quoted greater-than attributes", () => {
  const result = inspectHtml("https://example.com", '<a title="1 > 0" href="/x">X &amp; Y</a><h2>Unclosed heading');
  assert.equal(result.links[0].text, "X & Y");
  assert.equal(result.headings[0].text, "Unclosed heading");
});

test("limits text excerpt to 12000 characters", () => {
  const result = inspectHtml("https://example.com", `<p>${"x".repeat(13000)}</p>`);
  assert.equal(result.text_excerpt.length, 12000);
});

test("rejects invalid auditor inputs", () => {
  assert.throws(() => inspectHtml(null, ""), { message: "AFRIREA_HTML_INPUT_INVALID" });
  assert.throws(() => inspectHtml("not a url", ""), { message: "AFRIREA_BASE_URL_INVALID" });
});

test("preserves supplied response metadata", () => {
  const result = inspectHtml("https://example.com", "<p>OK</p>", 202, "application/xhtml+xml");
  assert.equal(result.http_status, 202);
  assert.equal(result.content_type, "application/xhtml+xml");
});


test("preserves literal less-than and greater-than text", () => {
  const result = inspectHtml("https://example.com", "<p>2 < 3 and 4 > 1</p>");
  assert.equal(result.text_excerpt, "2 < 3 and 4 > 1");
});

test("decodes HTML5 named entities in text and attributes", () => {
  const result = inspectHtml("https://example.com", `<title>&eacute; &mdash; &euro; &hellip;</title><meta name="description" content="&eacute; &copy;"><p>&eacute; &mdash; &euro;</p>`);
  assert.equal(result.title, "é — € …");
  assert.equal(result.description, "é ©");
  assert.equal(result.text_excerpt, "é — € … é — €");
});

test("finalizes self-closing headings without losing following content", () => {
  const result = inspectHtml("https://example.com", "<h1/>Outside<h2>Inside</h2><h3/>");
  assert.deepEqual(result.headings, [{ level: 2, text: "Inside" }]);
  assert.equal(result.text_excerpt, "Outside Inside");
});
