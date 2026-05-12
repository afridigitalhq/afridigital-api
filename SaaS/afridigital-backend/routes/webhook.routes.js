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

