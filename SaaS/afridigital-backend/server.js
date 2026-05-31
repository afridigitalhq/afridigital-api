const express = require("express");
const app = express();

app.use(express.json());

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afri-ai-saas-v4",
    mode: "PRODUCTION_PLATFORM",
    timestamp: Date.now()
  });
});

// ================= READINESS =================
app.get("/ready", (req, res) => {
  res.json({ ready: true });
});

// ================= V3 ENGINE =================
const v3 = require("./core/ai/gateway/v3/entry");

// ================= AI ROUTE =================
app.post("/v1/run", async (req, res) => {
  try {
    const result = await v3.runRequest(req.body || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: "AI_FAILURE",
      message: e.message
    });
  }
});

// ================= USAGE =================
const usageStore = require("./core/ai/gateway/v3/usage");

app.get("/v1/usage", (req, res) => {
  res.json(usageStore.getAll());
});

// ================= WHATSAPP WEBHOOK =================
const whatsapp = require("./core/ai/gateway/v4/whatsapp/webhook");
app.use("/webhook/whatsapp", whatsapp);

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SAAS PLATFORM v4 LIVE ON PORT", PORT);
});
