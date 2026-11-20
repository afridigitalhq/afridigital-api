import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import http from "node:http";
import { mountPublic } from "./public.boot.js";

test("public JSON parser skips only the internal A2A task endpoint", async t => {
  const app = express();
  mountPublic(app);
  app.post("/api/a2a/internal/tasks", express.raw({ type: "application/json", limit: "64kb" }), (req, res) => res.json({ isBuffer: Buffer.isBuffer(req.body), body: Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf8")) : req.body }));
  app.post("/api/public-probe", (req, res) => res.json({ isBuffer: Buffer.isBuffer(req.body), body: req.body }));
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  const base = "http://127.0.0.1:" + server.address().port;
  const internal = await fetch(base + "/api/a2a/internal/tasks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId: "AGENT-AFRIAICODER-001" }) });
  const internalData = await internal.json();
  assert.equal(internalData.isBuffer, true);
  assert.equal(internalData.body.agentId, "AGENT-AFRIAICODER-001");
  const ordinary = await fetch(base + "/api/public-probe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ normal: true }) });
  const ordinaryData = await ordinary.json();
  assert.equal(ordinaryData.isBuffer, false);
  assert.deepEqual(ordinaryData.body, { normal: true });
});
