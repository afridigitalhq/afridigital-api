/**
 * 🌐 A3.18.21 WEBHOOK SERVER (FINAL WIRED VERSION)
 */

const express = require("express");
const bodyParser = require("body-parser");

const {
  ingestWebhook,
  startLiveBrain
} = require("./live.bridge");

const app = express();
app.use(bodyParser.json());

/**
 * 🚀 START AI BRAIN
 */
startLiveBrain();

/**
 * 📡 REAL WHATSAPP ENTRY POINT
 */
app.post("/webhook/whatsapp", (req, res) => {
  return ingestWebhook(req, res);
});

/**
 * ❤️ HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    status: "A3.18.21 LIVE AI WHATSAPP BRAIN ONLINE"
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("🌐 WHATSAPP AI SERVER RUNNING ON PORT", PORT);
});

module.exports = app;
