/**
 * 🚀 A3.18.29 UNIFIED WHATSAPP ENTRYPOINT
 */

const express = require("express");
const bodyParser = require("body-parser");

const { ingestWebhook } = require("./core/runtime/server/live.bridge");
const { startLiveBrain } = require("./core/runtime/server/live.bridge");

const app = express();
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); }}));

/**
 * 💡 START AI CORE
 */
startLiveBrain();

/**
 * 📡 WHATSAPP WEBHOOK (META)
 */
app.post("/webhook/whatsapp", (req, res) => {
  return ingestWebhook(req, res);
});

/**
 * ❤️ HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    status: "A3.18.29 WHATSAPP PIPELINE LIVE"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 AFRIDIGITAL WHATSAPP AI FULL BRAIN STARTED ON", PORT);
});
