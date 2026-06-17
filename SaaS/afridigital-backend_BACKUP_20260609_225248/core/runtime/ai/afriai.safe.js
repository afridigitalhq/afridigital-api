const { emit } = require("../unified/event.bus");

function generateReply(text) {
  // SAFE FALLBACK BRAIN (no external API)
  if (!text) return "No input received.";

  if (text.includes("status")) return "System is operational.";
  if (text.includes("hello")) return "Hello 👋 I am AfriAI (safe mode).";
  if (text.includes("deploy")) return "Deployment command received (simulation mode).";

  return "I am in safe mode. AI engine not connected.";
}

function processWhatsAppAI(message) {
  const reply = generateReply(message.text);

  emit({
    type: "ai_response",
    payload: {
      to: message.from,
      reply
    }
  });

  return reply;
}

module.exports = { processWhatsAppAI };
