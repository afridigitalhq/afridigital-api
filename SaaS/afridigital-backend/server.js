const express = require("express");
const http = require("http");

const app = express();
app.use("/webhook/whatsapp", require("./routes/whatsapp.pipeline"));
const { mountWhatsApp } = require("./core/whatsapp"); 
mountWhatsApp(app);
app.use(express.json());

const server = http.createServer(app);
const { startKernelTick } = require("./core/kernel/tick/kernelTick"); 
const { attachFlowBridge } = require("./core/kernel/bridge/flowBridge"); 
const bus = require("./core/kernel/events/eventBus"); 


/**
 * HEALTH CORE
 */
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afridigital-api" });
});

/**
 * FLOW HEALTH (safe stub)
 */
app.get("/flow/health", (req, res) => {
  res.json({ ok: true, engine: "flowgraph", status: "stub-active" });
});

/**
  /**
   * WHATSAPP WEBHOOK (safe stub)
   */
  app.post("/webhook/whatsapp", (req, res) => {
    res.json({ ok: true, webhook: "active" });
  });

/**
 * OPTIONAL MODULE HOOKS (safe loaders)
 */
try {
} catch (e) {
  console.log("⚠️ FlowSocket disabled:", e.message);
}

try {
  const bus = require("./core/redis/streamBus");
  console.log("Redis stream bus loaded");
} catch (e) {
  console.log("⚠️ Redis stream fallback active (memory mode)");
}

/**
 * START SERVER
 */
try {
} catch (e) {
  console.log("⚠️ FlowSocket disabled:", e.message);
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 AFRI KERNEL STABLE ON PORT", PORT);
});
