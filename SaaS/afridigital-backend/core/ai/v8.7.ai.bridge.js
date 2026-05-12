const { assertApiVersion } = require("../runtime/safety/api.guard");
async function generateAIReply(message) {
  try {

    // fallback brain (replace later with real model)
    if (!message) return "I didn't receive a message.";

    const text = message.toLowerCase();

    if (text.includes("hello")) return "👋 Hello! I am AfriAI. How can I help you?";
    if (text.includes("price")) return "💰 I can help with pricing — what service?";
    if (text.includes("help")) return "🧠 AfriAI is online. Ask me anything.";

    return "🤖 I received: " + message;

  } catch (err) {
    console.error("AI ERROR:", err);
    return "⚠️ AI temporarily unavailable.";
  }
}

module.exports = { generateAIReply };
