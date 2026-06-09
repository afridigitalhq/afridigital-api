/**
 * AfriAI Adapter (v1)
 * Clean abstraction layer for AI calls
 */

async function askAfriAI(message) {
  try {
    // TODO: replace with real AfriAI endpoint later
    // for now we simulate safe AI response layer

    const text = message.text || "";

    return {
      reply: `🧠 AfriAI: I received "${text}"`,
      source: "afriai-v1-mock"
    };

  } catch (err) {
    return {
      reply: "⚠️ AfriAI error: fallback response triggered",
      source: "afriai-fallback"
    };
  }
}

module.exports = { askAfriAI };
