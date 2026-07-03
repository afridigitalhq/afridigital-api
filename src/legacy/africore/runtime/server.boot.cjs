const express = import "express");
const http = import "http");
const { WebSocketServer } = import "ws");

const { getInbox } = import "../whatsapp-ci/inbox.engine.js");
const { reviewPR, executeApprovedPR } = import "../whatsapp-ci/pr.engine.js");
const { getEvents, replay, getInsights } = import "../event-engine/engine.js");
const { getState } = import "../state.js");
const { getAttackTopology } = import "../intelligence/attack.topology.js");

const { createKernel } = import "../kernel/bootstrap/syscall.boot.js");
const mountKernelObservability = import "../kernel/contract/observability.routes.js");

function start() {
  const app = express();
  app.use(express.json());

  app.get("/", (_, res) => {
    res.json({ status: "AfriDigital legacy boot OK" });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  try {
    const kernel = createKernel?.();
    mountKernelObservability?.(app, kernel);
  } catch (e) {
    console.log("Kernel skipped:", e.message);
  }

  const PORT = process.env.PORT || 10000;
  server.listen(PORT, () => {
    console.log("Legacy server running on", PORT);
  });
}

module.exports = { start };
