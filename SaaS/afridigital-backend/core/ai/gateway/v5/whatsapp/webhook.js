const express = require("express");
const router = express.Router();
const bridge = require("./bridge");

// verification (Meta requirement)
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === config.get("whatsapp.verifyToken")) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// message receiver
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages;

    if (entry) {
      for (const msg of entry) {
        await bridge.handleMessage(msg);
      }
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("WEBHOOK ERROR", e);
    res.sendStatus(500);
  }
});

module.exports = router;
