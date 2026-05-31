console.log("🔥 SERVER BOOT FILE:", __filename);

const express = require("express");
const app = express();

app.use(express.json());

// ================= KERNEL CORE =================
const { run } = require("./core/ai/gateway/v5/kernel");
const usage = require("./core/ai/gateway/v5/usage/store");

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afri-ai-v5-kernel",
    mode: "STRICT_KERNEL"
  });
});

// ================= KERNEL ENDPOINT =================
app.post("/v1/run", async (req, res) => {
  try {
    const result = await run(req.body || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: "KERNEL_FAILURE",
      message: e.message
    });
  }
});

// ================= USAGE =================
app.get("/v1/usage", (req, res) => {
  res.json(usage.getAll());
});

// ================= WHATSAPP (STRICT ADAPTER ONLY) =================
const { handleWhatsApp } = require("./core/ai/gateway/v5/plugins/whatsapp/kernelAdapter");


// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 STRICT KERNEL v5 RUNNING ON", PORT);
});
const { handleStreamingWhatsApp } = require("./core/ai/gateway/v5/plugins/whatsapp/streamEngine");
app.post("/webhook/whatsapp", handleStreamingWhatsApp);
