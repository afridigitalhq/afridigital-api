const { sendWhatsAppMessage } = require("./whatsapp.service");
const { analyzeMessage } = require("./fraud.service");
const { normalizePhone } = require("../utils/normalizePhone");

function registerWebhook(app) {

  app.use(require("express").json());

  app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

  app.post("/webhook", async (req, res) => {
    try {
      console.log("🔥 WEBHOOK:", JSON.stringify(req.body, null, 2));

      const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!message) return res.sendStatus(200);

      const from = message.from;
      const text = message?.text?.body || "hello";

      const result = await analyzeMessage(text, from);

      const reply =
        result.action === "ALLOW"
          ? `✔ Received: ${text}`
          : `⚠ Message flagged`;

      await sendWhatsAppMessage(normalizePhone(from), reply);

      res.sendStatus(200);

    } catch (e) {
      console.log("WEBHOOK ERROR:", e.message);
      res.sendStatus(200);
    }
  });
}

module.exports = { registerWebhook };
