const express = require("express");
const router = express.Router();

const { detectIntent } = require("../modules/ai/router");
const memory = require("../modules/ai/redisMemory");
const { runPlugin } = require("../modules/plugins/engine");
const { chargeUser } = require("../modules/monetization/billing");
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

// WEBHOOK
router.post("/", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body || "";

    const intent = detectIntent(text);

    // 💰 monetization gate
    const billing = await chargeUser(from, 1);
    if (!billing.ok) {
      await whatsapp.sendMessage(from, "💳 Please recharge to continue using AI.");
      return res.sendStatus(200);
    }

    await memory.addMessage(from, text);

    const result = await runPlugin(intent, {
      message: text,
      phone: from
    });

    await whatsapp.sendMessage(from, result.reply);

    return res.sendStatus(200);

  } catch (err) {
    console.log("V14 ERROR:", err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
