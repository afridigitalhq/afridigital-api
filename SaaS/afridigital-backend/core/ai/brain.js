const memoryStore = require('../memory/store');

function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi")) return "greeting";
  if (t.includes("price") || t.includes("cost")) return "pricing";
  if (t.includes("help")) return "support";

  return "general";
}

function generateResponse(intent, payload, context) {
  const text = payload.text || "";

  switch (intent) {
    case "greeting":
      return `Hello 👋 again ${payload.from}. How can I help today?`;

    case "pricing":
      return `Pricing request noted. Last chat had ${context.messages.length} messages.`;

    case "support":
      return `Support is active. We saw you previously said: "${context.messages.at(-1)?.text || 'nothing yet'}"`;

    default:
      return `Echo: ${text}`;
  }
}

function runBrain(payload) {
  const userId = payload.from || "anonymous";

  const context = memoryStore.getContext(userId);

  const intent = detectIntent(payload.text);

  memoryStore.pushMessage(userId, payload);
  memoryStore.setIntent(userId, intent);

  const reply = generateResponse(intent, payload, context);

  return {
    intent,
    reply,
    memorySize: context.messages.length
  };
}

module.exports = { runBrain };
