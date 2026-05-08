const express = require("express");
const router = express.Router();

const { generateReply } = require("../modules/ai/whatsappAI");
const memory = require("../modules/ai/memory");
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

// RECEIVE + AI RESPONSE
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    // store memory
    memory.addMessage(from, text);

    const context = memory.getUser(from);

    // AI reply
    const ai = await generateReply(text, context);

    // send reply
    await whatsapp.sendMessage(from, ai.reply);

    return res.sendStatus(200);

  } catch (err) {
    console.log("WA ERROR:", err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
