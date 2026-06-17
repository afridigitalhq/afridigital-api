/**
 * 🧠 AFRISCAN WHATSAPP AI LAYER (SAFE MODE)
 * - no system execution
 * - only conversational response generation
 */

const { normalize } = require("../schema/event.schema");

async function generateAIResponse(message) {
  // placeholder safe brain (replace later with OpenAI/LLM call)
  const text = message.text || "";

  if (text.toLowerCase().includes("status")) {
    return "🧠 System is stable. AFRISCAN monitoring active.";
  }

  if (text.toLowerCase().includes("hello")) {
    return "👋 Hello. AFRISCAN AI is online and observing safely.";
  }

  return "🧠 Message received. AFRISCAN AI is in safe mode (no execution allowed).";
}

function formatAIEvent(from, reply) {
  return normalize("whatsapp_ai_reply", {
    to: from,
    reply
  });
}

module.exports = {
  generateAIResponse,
  formatAIEvent
};
