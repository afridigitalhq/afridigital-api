module.exports = async function internalAI(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hello")) return "👋 Hello! AfriDigital AI is active.";
  if (msg.includes("price")) return "💰 Pricing info is being processed internally.";
  if (msg.includes("help")) return "🧠 I can help with DevOps, WhatsApp automation, and AfriDigital services.";

  return "⚙️ Internal AI: Request received. Processing...";
};
