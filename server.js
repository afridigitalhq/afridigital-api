require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const server = http.createServer(app);

/* ================= CORE MODULES ================= */
const { getInbox } = require("./core/whatsapp-ci/inbox");
const { reviewPR, executeApprovedPR } = require("./core/whatsapp-ci/pr.engine");
const { getEvents, replay, getInsights } = require("./core/event-engine/engine");
const { getState } = require("./core/ci/state");
const { getAttackTopology } = require("./core/intelligence/attack.topology");

const createKernel = require("./core/kernel/bootstrap/syscall.boot").createKernel;
const mountKernelObservability = require("./core/kernel/contract/observability.routes");

const kernel = createKernel({});

/* ================= KERNEL ================= */
mountKernelObservability(app, kernel);

/* ================= ROUTES ================= */
app.get("/health", (_, res) => {
  res.json({
    ok: true,
    kernel: "v4-recovered",
    service: "afridigital-api"
  });
});

app.get("/status", (_, res) => {
  res.json({ ok: true, kernel: "v4-recovered", service: "afridigital-api", status: "running" });
});

app.get("/api", (_, res) => {
  res.json({
    ok: true,
    service: "afridigital-api",
    kernel: "v4-recovered"
  });
});

app.get("/api/whatsapp/inbox", (req, res) => {
  const role = req.query.role || "VIEWER";
  res.json(getInbox(role));
});

app.post("/api/whatsapp/pr/action", (req, res) => {
  try {
    const { prId, reviewerId } = req.body;

    const pr = reviewPR({
      prId,
      reviewerId,
      action: "APPROVE"
    });

    const result = executeApprovedPR(pr);

    res.json({ status: pr.status, pr, result });
  } catch (e) {
    res.status(500).json({ error: "PR_ACTION_FAILED" });
  }
});

app.get("/api/events", (_, res) => {
  res.json({ ok: true, events: getEvents() });
});

app.get("/api/events/history", (req, res) => {
  const from = parseInt(req.query.from || "0");
  const to = parseInt(req.query.to || "999999");
  res.json({ ok: true, events: replay(from, to) });
});

app.get("/api/events/insights", (_, res) => {
  res.json({ ok: true, insights: getInsights() });
});

app.get("/api/ci/state", (_, res) => {
  res.json(getState());
});

app.get("/api/topology", (_, res) => {
  res.json({ ok: true, topology: getAttackTopology() });
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🟢 SERVER REBUILT FROM RECOVERY CORE");
  console.log("🚀 PORT:", PORT);
});
