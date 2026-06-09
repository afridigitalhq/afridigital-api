
const express = require("express");
const app = express();

const { run } = require("./core/ai/gateway/v5/kernel");
const usage = require("./core/ai/gateway/v5/usage/store");

const whatsappDelivery = require("./core/ai/gateway/v5/plugins/whatsapp/delivery");

app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afri-ai-v5-kernel",
    mode: "STRICT_KERNEL"
  });
});

// AI RUN
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

// USAGE
app.get("/v1/usage", (req, res) => {
  res.json(usage.getAll());
});

// WHATSAPP V2 (CLEAN SINGLE BLOCK)
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const { handleStreamingWhatsApp } =
      require("./core/ai/gateway/v5/plugins/whatsapp/kernelAdapter");

    const result = await handleStreamingWhatsApp(req.body || {});

    whatsappDelivery.enqueue({
      text: req.body?.text || "",
      meta: result
    });

    return res.json({
      ok: true,
      queued: true,
      reply: result.reply,
      streamed: true
    });

  } catch (err) {
    console.error("WHATSAPP ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 STRICT KERNEL v5 RUNNING ON", PORT);
});
