const { askAfriAI } = require("../../adapters/ai/afriAI");

async function flowEngine(message) {
  
const text =
  typeof message.text === 'string'
    ? message.text.toLowerCase()
    : (message.text?.body || '').toLowerCase();


  // 🔹 simple rule-based shortcuts first
  if (text.includes("hello")) {
    return "👋 hello from AfriDigital system";
  }

  if (text.includes("help")) {
    return "🛠 I can assist you via AfriAI engine";
  }

  // 🧠 AI fallback path
  
const ai = await askAfriAI({
  text,
  from: message.from,
  messageId: message.id
});


  
return ai?.reply || "⚠️ AI temporarily unavailable";

}

module.exports = { flowEngine };
