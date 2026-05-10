const { generateAIReply } = require('../../core/ai/v8.7.ai.bridge');
const dispatcher=require('../modules/dispatcher');
const brain=require('../modules/brain');
const sendWhatsApp = require("../modules/chat/whatsappSender");
const { handleIncomingMessage } = require("../modules/chat");

exports.verify = (req, res) => {
  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN || "afridigital_verify";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};
exports.receive = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
console.log("🔥 WHATSAPP WEBHOOK HIT");
    const message = value?.messages?.[0];
    if (!message) {
      return res.sendStatus(200);
    }
    const from = message.from;
    const text = message.text?.body || "";
    console.log("WhatsApp:", from, text);
    const aiResponse = await handleIncomingMessage({
      message: text,
      channel: "whatsapp",
      from
    });
    console.log("AI Response:", aiResponse);
    await sendWhatsApp(from, aiResponse || "Processed.");
    return res.sendStatus(200);
  } catch (err) {
    console.error("WhatsApp Error:", err);
    return res.sendStatus(500);
const memoryInstance = require('../modules/memory');
