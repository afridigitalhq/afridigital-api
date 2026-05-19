// ===============================
// AFRIAI WHATSAPP WEBHOOK CORE
// ===============================

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

function setupWebhook(app, sendWhatsAppMessage, buildAfriAiResponse) {

  // META VERIFICATION (GET)
  app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("[WEBHOOK VERIFY]", { mode, token });

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WhatsApp webhook verified");
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

  // MESSAGE RECEIVER (POST)
  app.post("/webhook", async (req, res) => {
    try {
      const body = req.body;

      const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!msg) return res.sendStatus(200);

      const from = msg.from;
      const text = msg.text?.body || "";

      console.log("[WHATSAPP INCOMING]", from, text);

      const ai = buildAfriAiResponse(text);
      const reply = ai?.content?.value || ai?.content || "AfriAi active 🤖";

      await sendWhatsAppMessage(from, String(reply));

      return res.sendStatus(200);

    } catch (err) {
      console.log("Webhook Error:", err.message);
      return res.sendStatus(200);
    }
  });
}

module.exports = setupWebhook;
