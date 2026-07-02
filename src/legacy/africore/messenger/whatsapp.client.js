const http = require("../runtime/http.client");
const { withRetry } = require("../runtime/retry.engine");
const queue = require("../runtime/message.queue");

const BASE_URL = "https://graph.facebook.com/v19.0";

async function send(to, message) {
  const url = `${BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  };

  try {
    const result = await withRetry(async () => {
      return await http.post(url, {
        headers: {
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`
        },
        body: payload
      });
    });

    console.log("📡 UNDICI SEND:", result.status, result.data);

    return result;
  } catch (e) {
    console.log("⚠️ Queue fallback triggered:", e.message);
    queue.enqueue({ url, payload });
    return { status: "QUEUED" };
  }
}

module.exports = { send };
