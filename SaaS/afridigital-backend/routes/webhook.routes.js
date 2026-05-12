module.exports = (app, engine) => {

  app.get("/webhook", (req, res) => {

    const VERIFY_TOKEN =
      process.env.WHATSAPP_VERIFY_TOKEN ||
      "afri_ai_2026_secure";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(String(challenge));
    }

    return res.sendStatus(403);
  });

  app.post("/webhook", (req, res) => {

    res.sendStatus(200);

    try {

      const msg =
        req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!msg) return;

      const from = msg.from;
      const text = msg.text?.body || "";

      console.log("[WHATSAPP IN]", from, text);

      console.log("ENQUEUE HIT"), engine.enqueue({
        from,
        text: String(text).slice(0, 2000)
      });

    } catch (err) {
      console.log("[WEBHOOK ERROR]", err.message);
    }
  });

};
