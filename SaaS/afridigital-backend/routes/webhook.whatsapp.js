// SINGLE_KERNEL_ROUTE=true
const express = require("express");
const router = express.Router();

const { messagePipeline } = require("../core/pipeline/messagePipeline");
const { flowEngine } = require("../core/engine/flowEngine");
const { sendMessage } = require("../adapters/whatsapp/sendMessage");

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.get("whatsapp.verifyToken")) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

console.log("🔥 WEBHOOK HIT:", JSON.stringify(req.body || {}));
router.post("/", async (req, res) => {
  const result = messagePipeline(req);

  if (!result.ok) return res.sendStatus(200);

  const reply = await flowEngine(result.message);

  await sendMessage(result.message.from, reply);

  return res.sendStatus(200);
});

module.exports = router;
