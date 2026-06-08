const { askAfriAI } = require("../../adapters/ai/afriAI");

async function flowEngine(message) {
  const text = (message.text || "").toLowerCase();

  // 🔹 simple rule-based shortcuts first
  if (text.includes("hello")) {
    return "👋 hello from AfriDigital system";
  }

  if (text.includes("help")) {
    return "🛠 I can assist you via AfriAI engine";
  }

  // 🧠 AI fallback path
  const ai = await askAfriAI(message);

  return ai.reply;
}

module.exports = { flowEngine };
