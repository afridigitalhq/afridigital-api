const express = require("express");
const app = express();

const gateway = require("./entry");
const auth = require("../../../saas/auth");
const usage = require("../../../saas/usage");

app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "afri-ai-gateway-v5-render-v1"
  });
});

// MAIN AI ROUTE

// DISABLED_AI_WEBHOOK_CONFLICT
app.post("/v1/run", async (req, res) => {
  try {
    if (!auth.validateKey(req.body.apiKey)) {
      return res.status(401).json({ error: "INVALID_API_KEY" });
    }

    const result = await gateway.runRequest(req.body);
    res.json(result);

  } catch (e) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: e.message
    });
  }
});

// USAGE DASHBOARD (BASIC)
app.get("/v1/usage", (req, res) => {
  res.json(usage.getAll());
});

const PORT = process.env.PORT || 3000;

console.log("DISABLED_LISTENER")(PORT, () => {
  console.log("🚀 RENDER SAAS v1 LIVE ON PORT", PORT);
});

module.exports = app;
