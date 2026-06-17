const axios = require("axios");
const gateway = require("../entry");

async function sendMessage(to, text) {
  const TOKEN = config.get("whatsapp.token");

  if (!TOKEN) {
    console.log("[MOCK WHATSAPP SEND]", { to, text });
    return;
  }

  await axios.post(
    "https://graph.facebook.com/v19.0/me/messages",
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

async function handleMessage(msg) {
  const text = msg.text?.body || "";
  const from = msg.from;

  const result = await gateway.runRequest({
    apiKey: "whatsapp_user",
    text,
    streamId: "wa_" + Date.now(),
    auto: true
  });

  await sendMessage(from, result.text);
}

module.exports = { handleMessage };
