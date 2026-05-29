const redis = require("../redis/client");
const axios = require("axios");

const CHANNEL = "afriai:typing";

/**
 * WhatsApp typing API (provider agnostic)
 */
async function sendTyping(to, on) {

  try {
    await axios.post(process.env.WHATSAPP_API_URL + "/typing", {
      to,
      typing: on
    }, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

  } catch (e) {
    console.log("⚠️ typing emit failed:", e.message);
  }
}

/**
 * Listen for typing events from Redis
 */
function startTypingBridge() {

  const sub = redis.duplicate();
  sub.subscribe(CHANNEL);

  console.log("⌨️ Typing Bridge ACTIVE");

  sub.on("message", async (_, msg) => {

    const { sessionId, state } = JSON.parse(msg);

    await sendTyping(sessionId, state === "on");
  });
}

module.exports = { startTypingBridge };
