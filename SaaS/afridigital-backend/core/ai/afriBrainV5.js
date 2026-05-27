const fs = require("fs");

function simpleAI(prompt, context = {}) {
  // 🧠 placeholder brain (we can plug OpenAI later)
  return `
🧠 AFRI v5 AI RESPONSE

Input: ${prompt}

System Context:
- server: ${context.server || "unknown"}
- kernel: ${context.kernel ? "OK" : "MISSING"}

Suggestion:
I can interpret system state and propose actions,
but full reasoning engine can be upgraded to OpenAI API next step.
  `;
}

module.exports = { simpleAI };
