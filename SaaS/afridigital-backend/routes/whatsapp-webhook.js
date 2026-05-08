const express = require("express");
const router = express.Router();

const { detectIntent } = require("../modules/ai/router");
const memoryInstance = require("../modules/ai/redisMemory");
const { runPlugin } = require("../modules/plugins/engine");
const control = require("../modules/control-plane");
const whatsapp = require("../modules/whatsapp");

router.post("/", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body || "";

    const intent = detectIntent(text);

    const state = control.getState();

    // 🚫 blocked agents
    if (!state.agents.afrilove && intent === "afrilove") {
      await whatsapp.sendMessage(from, "⚠️ AfriLove service is currently disabled.");
      return res.sendStatus(200);
    }

    await memory.addMessage(from, text);

    const result = await runPlugin(intent, {
      message: text,
      // evolution tracking injected manually in plugins
      phone: from
    });

    await whatsapp.sendMessage(from, result.reply);

    res.sendStatus(200);

  } catch (e) {
    console.log("V15 ERROR:", e.message);
    res.sendStatus(200);
  }
});

module.exports = router;
