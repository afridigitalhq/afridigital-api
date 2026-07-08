import dotenv from "dotenv"; dotenv.config();
dotenv.config();

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { mountWS } from "./bootstrap/ws/init-ws.js";

// ✅ FIXED IMPORT PATHS (MATCH YOUR REAL CORE STRUCTURE)
import { getInbox } from "./core/whatsapp-ci/inbox.engine.js";
import { reviewPR, executeApprovedPR } from "./core/whatsapp-ci/pr.engine.js";
import { getEvents, replay, getInsights } from "./core/event-engine/engine.js";
import { getState } from "./core/ci/state.js";
import { getAttackTopology } from "./core/intelligence/attack.topology.js";

import { createKernel } from "./core/kernel/bootstrap/syscall.boot.js";
import mountKernelObservability from "./core/kernel/contract/observability.routes.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    status: "AfriDigital API live 🚀",
    runtime: "ESM"
  });
});

app.get("/api/soc", (_, res) => {
  res.json({
    status: "SOC active",
    modules: ["kernel", "events", "intelligence", "ci"]
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
mountWS(server);

try {
  const kernel = createKernel?.();
  mountKernelObservability?.(app, kernel);
} catch (e) {
  console.log("Kernel init skipped:", e.message);
}

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log("🚀 AfriDigital API running on port", PORT);
});
