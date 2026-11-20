import test from "node:test";
import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import { main, runAfriREACommand } from "./AfriREACommand.js";

const html = "<html><head><title>Example</title></head><body><h1>Hello</h1></body></html>";

test("CLI maps fetch validation errors to the legacy JSON contract", async () => {
  let called = 0;
  const result = await runAfriREACommand(
    { url: "not-a-valid-url" },
    {
      fetchPage: async url => {
        called++;
        assert.equal(url, "not-a-valid-url");
        return { ok: false, reason: "HTTPS_REQUIRED" };
      }
    }
  );
  assert.deepEqual(result, { ok: false, error: "HTTPS_REQUIRED" });
  assert.equal(called, 1);
});

test("CLI returns structured robots denial", async () => {
  const result = await runAfriREACommand(
    { url: "https://example.com" },
    { fetchPage: async () => ({ ok: false, reason: "ROBOTS_POLICY_DENIED" }) }
  );
  assert.deepEqual(result, { ok: false, error: "ROBOTS_POLICY_DENIED" });
});

test("CLI returns structured analysis on success", async () => {
  const result = await runAfriREACommand(
    { url: "https://example.com" },
    {
      fetchPage: async () => ({
        ok: true,
        url: "https://example.com",
        content_type: "text/html",
        body: Buffer.from(html)
      })
    }
  );
  assert.equal(result.ok, true);
  assert.equal(result.analysis.url, "https://example.com/");
  assert.equal(result.analysis.title, "Example");
  assert.match(result.analysis.sha256, /^[a-f0-9]{64}$/);
});

test("CLI rejects missing URL without fetching", async () => {
  let called = false;
  const result = await runAfriREACommand(
    {},
    { fetchPage: async () => { called = true; } }
  );
  assert.deepEqual(result, { ok: false, error: "AFRIREA_URL_REQUIRED" });
  assert.equal(called, false);
});

test("CLI rejects non-object requests", async () => {
  assert.deepEqual(
    await runAfriREACommand([]),
    { ok: false, error: "REQUEST_OBJECT_REQUIRED" }
  );
});

test("CLI converts malformed JSON stdin into one JSON response and exit zero", async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let output = "";
  stdout.on("data", chunk => { output += chunk.toString(); });

  const done = main({ stdin, stdout });
  stdin.end("{");

  assert.equal(await done, 0);
  assert.deepEqual(JSON.parse(output), {
    ok: false,
    error: "AFRIREA_REQUEST_INVALID"
  });
});

test("CLI writes one JSON line for a valid stdin request", async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let output = "";
  stdout.on("data", chunk => { output += chunk.toString(); });

  const done = main({
    stdin,
    stdout,
    dependencies: {
      fetchPage: async () => ({
        ok: false,
        reason: "ROBOTS_POLICY_DENIED"
      })
    }
  });

  stdin.end(JSON.stringify({ url: "https://example.com" }));

  assert.equal(await done, 0);
  assert.equal(output.trim().split("\n").length, 1);
  assert.deepEqual(JSON.parse(output), {
    ok: false,
    error: "ROBOTS_POLICY_DENIED"
  });
});


test("CLI rejects oversized stdin before invoking the fetcher", async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let output = "";
  let called = false;
  stdout.on("data", chunk => { output += chunk.toString(); });
  const done = main({ stdin, stdout, dependencies: { fetchPage: async () => { called = true; } } });
  stdin.end(" ".repeat(16385));
  assert.equal(await done, 0);
  assert.deepEqual(JSON.parse(output), { ok: false, error: "AFRIREA_REQUEST_TOO_LARGE" });
  assert.equal(called, false);
});

test("CLI preserves UTF-8 characters split across stdin chunks", async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let output = "";
  stdout.on("data", chunk => { output += chunk.toString(); });
  const expectedUrl = "https://example.com/é";
  const bytes = Buffer.from(JSON.stringify({ url: expectedUrl }));
  const split = bytes.indexOf(Buffer.from("é")) + 1;
  const done = main({ stdin, stdout, dependencies: { fetchPage: async url => {
    assert.equal(url, expectedUrl);
    return { ok: false, reason: "ROBOTS_POLICY_DENIED" };
  } } });
  stdin.write(bytes.subarray(0, split));
  stdin.end(bytes.subarray(split));
  assert.equal(await done, 0);
  assert.deepEqual(JSON.parse(output), { ok: false, error: "ROBOTS_POLICY_DENIED" });
});
