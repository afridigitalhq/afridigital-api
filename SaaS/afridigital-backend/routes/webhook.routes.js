module.exports = (app, engine) => {

  app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "afri_ai_2026_secure";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (!mode || !token) {
      return res.sendStatus(400);
    }

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

  app.post("/webhook", (req, res) => {
    res.sendStatus(200);

    try {
      const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!msg) return;

      engine.enqueue({
        from: msg.from,
        text: msg.text?.body || ""
      });

    } catch (err) {
      console.log("WEBHOOK POST ERROR:", err.message);
    }
  });

};
