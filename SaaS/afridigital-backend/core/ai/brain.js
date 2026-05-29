function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi")) return "greeting";
  if (t.includes("price") || t.includes("cost")) return "pricing";
  if (t.includes("help")) return "support";

  return "general";
}

function generateResponse(intent, payload) {
  const text = payload.text || "";

  switch (intent) {
    case "greeting":
      return "Hello 👋 welcome to AfriDigital AI.";

    case "pricing":
      return "Pricing info is being processed. Please check dashboard.";

    case "support":
      return "Support team will respond shortly.";

    default:
      return `Echo: ${text}`;
  }
}

function runBrain(payload) {
  const intent = detectIntent(payload.text);
  const reply = generateResponse(intent, payload);

  return {
    intent,
    reply
  };
}

module.exports = { runBrain };
