const chatModule = require("../modules/chat");
const sendWhatsApp = require("../modules/chat/whatsappSender");

exports.verify = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "afridigital_verify";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

exports.receive = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("📩 WhatsApp:", from, text);

    // 🔥 Send into existing chat module
    const aiResponse = await aiRouter({ message: text, channel: "whatsapp", from });

    // 🔥 Send back to user
    await sendWhatsApp(from, aiResponse || "✅ Processed.");

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ WhatsApp Error:", err);
    res.sendStatus(500);
  }
};
