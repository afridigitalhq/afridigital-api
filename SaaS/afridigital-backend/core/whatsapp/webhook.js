const express = require("express");
const router = express.Router();
const { runStreaming } = require("./stream/engine");

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === config.get("whatsapp.verifyToken")) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

router.post("/", async (req, res) => {
  try {
    const messages =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages || [];

    for (const msg of messages) {
      const text = msg.text?.body || "";
      const from = msg.from;

      await runStreaming(from, {
        apiKey: "whatsapp_user",
        text,
        streamId: "wa_stream_" + Date.now(),
        auto: true
      });
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("STREAM WEBHOOK ERROR:", e);
    res.sendStatus(500);
  }
});

module.exports = router;
