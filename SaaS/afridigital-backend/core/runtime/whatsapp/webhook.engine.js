const { emit } = require("../unified/event.bus");

function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

function parseIncoming(req) {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) return null;

    return {
      from: message.from,
      text: message.text?.body || "",
      raw: message
    };
  } catch (e) {
    return null;
  }
}

function emitWhatsAppEvent(message) {
  emit({
    type: "whatsapp_inbound",
    payload: message
  });
}

module.exports = {
  verifyWebhook,
  parseIncoming,
  emitWhatsAppEvent
};
