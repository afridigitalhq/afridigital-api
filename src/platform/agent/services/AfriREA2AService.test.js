import test from "node:test";
import assert from "node:assert/strict";
import { createAfriREA2AService } from "./AfriREA2AService.js";

const originalEnabled = process.env.AFRIREA_ENABLED;

function restoreEnabled() {
  if (originalEnabled === undefined) delete process.env.AFRIREA_ENABLED;
  else process.env.AFRIREA_ENABLED = originalEnabled;
}

test("rejects calls while AfriREA is disabled", async () => {
  process.env.AFRIREA_ENABLED = "false";
  const service = createAfriREA2AService();
  await assert.rejects(() => service.analyze({url:"https://example.com"}), {message:"AFRIREA_DISABLED"});
  restoreEnabled();
});

test("rejects invalid payload objects", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService();
  await assert.rejects(() => service.analyze(null), {message:"AFRIREA_PAYLOAD_INVALID"});
  await assert.rejects(() => service.analyze([]), {message:"AFRIREA_PAYLOAD_INVALID"});
  restoreEnabled();
});

test("blocks local paths and caller-supplied HTML", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService();
  for (const payload of [
    {url:"https://example.com",path:"/etc/passwd"},
    {url:"https://example.com",repositoryPath:"/repo"},
    {url:"https://example.com",html:"<h1>Injected</h1>"}
  ]) {
    await assert.rejects(() => service.analyze(payload), {message:"AFRIREA_LOCAL_PATH_OR_RAW_HTML_FORBIDDEN"});
  }
  restoreEnabled();
});

test("rejects missing, blank and oversized URLs", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService();
  await assert.rejects(() => service.analyze({}), {message:"AFRIREA_URL_REQUIRED"});
  await assert.rejects(() => service.analyze({url:"  "}), {message:"AFRIREA_URL_REQUIRED"});
  await assert.rejects(() => service.analyze({url:"x".repeat(2049)}), {message:"AFRIREA_URL_REQUIRED"});
  restoreEnabled();
});

test("maps fetch failures to stable error codes", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService({
    fetchPage: async () => ({ok:false,reason:"ROBOTS_POLICY_CHECKED"})
  });
  await assert.rejects(() => service.analyze({url:"https://example.com"}), {message:"ROBOTS_POLICY_CHECKED"});
  restoreEnabled();
});

test("returns the preserved A2A result contract", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService({
    fetchPage: async url => ({
      ok:true,
      url,
      content_type:"text/html",
      body:Buffer.from("<h1>AfriREA</h1>")
    }),
    inspectHtml: (url,html,status,contentType) => ({
      url,
      title:"AfriREA",
      html,
      http_status:status,
      content_type:contentType
    })
  });
  const result = await service.analyze(
    {url:" https://example.com "},
    {taskId:"TASK-TEST-001"}
  );
  assert.equal(result.service,"AfriREA");
  assert.equal(result.capability,"research.analyze");
  assert.equal(result.status,"COMPLETED");
  assert.equal(result.taskId,"TASK-TEST-001");
  assert.equal(result.analysis.title,"AfriREA");
  assert.equal(result.analysis.html,"<h1>AfriREA</h1>");
  restoreEnabled();
});

test("uses null taskId when no task context is supplied", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService({
    fetchPage: async url => ({ok:true,url,content_type:"text/html",body:Buffer.from("OK")}),
    inspectHtml: () => ({title:"OK"})
  });
  const result = await service.analyze({url:"https://example.com"});
  assert.equal(result.taskId,null);
  restoreEnabled();
});

test("research uses the registered URL adapter and returns structured findings", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService({
    fetchPage: async url => ({
      ok: true,
      url,
      content_type: "text/html",
      bytes: 20,
      body: Buffer.from("<title>AutoCAD</title>")
    }),
    inspectHtml: () => ({
      title: "AutoCAD",
      headings: [{ text: "Documentation" }]
    })
  });

  const result = await service.research({
    objective: "Research AutoCAD documentation",
    domain: "architecture",
    sources: [{
      sourceId: "AUTOCAD-DOCS",
      type: "URL",
      origin: "PUBLIC_URL",
      url: "https://example.com/autocad"
    }]
  });

  assert.equal(result.service, "AfriREA");
  assert.equal(result.status, "COMPLETED");
  assert.equal(result.sources[0].status, "COMPLETED");
  assert.equal(result.findings[0].sourceId, "AUTOCAD-DOCS");
  assert.equal(result.findings[0].analysis.title, "AutoCAD");
  assert.equal(result.evidence[0].locator, "https://example.com/autocad");
  restoreEnabled();
});

test("research reports unsupported source types without losing URL findings", async () => {
  process.env.AFRIREA_ENABLED = "true";
  const service = createAfriREA2AService({
    fetchPage: async url => ({
      ok: true,
      url,
      content_type: "text/html",
      body: Buffer.from("<title>Reference</title>")
    }),
    inspectHtml: () => ({ title: "Reference" })
  });

  const result = await service.research({
    objective: "Research a design reference",
    domain: "architecture",
    sources: [
      {
        sourceId: "WEB-1",
        type: "URL",
        origin: "PUBLIC_URL",
        url: "https://example.com/reference"
      },
      {
        sourceId: "IMAGE-1",
        type: "SCREENSHOT",
        origin: "USER_UPLOAD",
        fileId: "uploaded-image-001"
      }
    ]
  });

  assert.equal(result.status, "PARTIAL");
  assert.equal(result.findings.length, 1);
  assert.equal(result.sources[1].status, "UNSUPPORTED");
  assert.equal(result.sources[1].errorCode, "AFRIREA_SOURCE_ADAPTER_UNAVAILABLE");
  restoreEnabled();
});

test("rejects structured research while AfriREA is disabled", async () => {
  process.env.AFRIREA_ENABLED = "false";
  const service = createAfriREA2AService();

  await assert.rejects(
    () => service.research({}),
    { message: "AFRIREA_DISABLED" }
  );
  restoreEnabled();
});
