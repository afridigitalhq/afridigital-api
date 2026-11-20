import test from "node:test";
import assert from "node:assert/strict";
import route from "./agent-platform-readiness.route.js";
function response() { return { code: 0, body: null, status(n) { this.code=n; return this; }, json(v) { this.body=v; return this; } }; }
test("readiness endpoint reports 503 before initialization", async () => {
  let handler;
  route({ get(p,h) { assert.equal(p, "/api/agent-platform/readiness"); handler=h; } }, async () => ({ ready:false, status:"NOT_READY" }));
  const res=response(); await handler({},res);
  assert.equal(res.code,503); assert.equal(res.body.status,"NOT_READY");
});
test("readiness endpoint reports 200 when ready", async () => {
  let handler;
  route({ get(p,h) { handler=h; } }, async () => ({ ready:true, status:"READY" }));
  const res=response(); await handler({},res);
  assert.equal(res.code,200);
});
test("readiness endpoint converts unexpected probe errors to 503 without leaking details", async () => {
  let handler;
  route({ get(p,h) { handler=h; } }, async () => { throw new Error("private database details"); });
  const res=response(); await handler({},res);
  assert.equal(res.code,503);
  assert.equal(res.body.status,"NOT_READY");
  assert.equal(JSON.stringify(res.body).includes("private database details"),false);
});