const express = require('express');
const app = express();

app.use(express.json());

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

// HEALTH CHECK (Render safe)
app.get("/health", (req, res) => {
  res.json({ status: "ok", kernel: "v8.1-real" });
});

// WEBHOOK
const { webhook } = require("./core/webhooks/whatsapp.webhook");
app.post("/webhook", webhook);

// BOOT STRAP (EXISTING STABLE KERNEL)
const { boot } = require("./core/bootstrap/v8.kernel");
const { startWorker } = require("./core/workers/message.worker");

boot(app);
// startRetryWorker() removed (undefined);
startWorker();

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 V8.1 REAL KERNEL RUNNING ON PORT", PORT);
});
