const { sendMessage } = require("../../integrations/whatsapp/cloud.client");

async function handleIncomingWhatsApp(event) {
  try {
    const { from, message } = event.data;

    console.log("📩 WHATSAPP EVENT RECEIVED:", message);

    // 🤖 SIMPLE AI LOGIC (SAFE MODE)
    let reply = "Message received.";

    if (message.includes("hello")) {
      reply = "👋 Hello from AfriAI safe mode";
    }

    if (message.includes("status")) {
      reply = "🟢 System operational (AFRISCAN live)";
    }

    // 📡 SEND VIA META CLOUD API
    await sendMessage(from, reply);

    return {
      mode: "ai",
      reply
    };

  } catch (err) {
    return { status: "error", error: err.message };
  }
}

module.exports = {
  handleIncomingWhatsApp
};
