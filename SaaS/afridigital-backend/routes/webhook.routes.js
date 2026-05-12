module.exports = (app) => {

  app.get("/webhook", (req, res) => {
    try {
      const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "afri_ai_2026_secure";
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      }

      return res.sendStatus(403);
    } catch (err) {
      console.log("WEBHOOK ERROR:", err.message);
      return res.sendStatus(500);
    }
  });

};
