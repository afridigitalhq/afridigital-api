const express = require("express");
const router = express.Router();

const { detectIntent } = require("../modules/ai/router");
const memory = require("../modules/ai/redisMemory");
const { dispatchAgent } = require("../modules/ai/agents");
const whatsapp = require("../modules/whatsapp");

// VERIFY
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// RECEIVE MESSAGE
router.post("/", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body || "";

    const intent = detectIntent(text);

    const context = await memory.addMessage(from, text);

    const result = dispatchAgent(intent, text, context);

    await whatsapp.sendMessage(from, result.reply);

    return res.sendStatus(200);

  } catch (err) {
    console.log("V13 ERROR:", err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
