const express = require("express");
const router = express.Router();
const v3 = require("../../v3/entry");

// VERIFY (Meta requirement)
router.get("/", (req, res) => {
  const challenge = req.query["hub.challenge"];
  res.send(challenge || "ok");
});

// RECEIVE MESSAGE
router.post("/", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    const text = msg.text?.body || "";
    const from = msg.from;

    const result = await v3.runRequest({
      apiKey: "whatsapp_user",
      text
    });

    console.log("[WHATSAPP RESPONSE]", {
      to: from,
      text: result.text
    });

    res.sendStatus(200);
  } catch (e) {
    console.error("WHATSAPP ERROR", e);
    res.sendStatus(200);
  }
});

module.exports = router;
