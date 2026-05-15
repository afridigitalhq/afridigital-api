/**
 * 🚀 A3.18.31 SINGLE ENTRY EXPRESS SERVER (CLEAN FIX)
 */

const express = require("express");
const bodyParser = require("body-parser");

const { ingestWebhook, startLiveBrain } = require("./core/runtime/server/live.bridge");

const app = express();
app.use(bodyParser.json());

/**
 * START AI CORE
 */
startLiveBrain();

/**
 * WHATSAPP WEBHOOK (ONLY ONE)
 */
app.post("/webhook/whatsapp", (req, res) => {
  return ingestWebhook(req, res);
});

/**
 * HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "AFRIDIGITAL WHATSAPP PIPELINE A3.18.31"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 AFRIDIGITAL LIVE ON PORT", PORT);
});
