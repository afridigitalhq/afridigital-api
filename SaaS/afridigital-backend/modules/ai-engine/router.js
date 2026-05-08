const internalAI = require("./internal");
const truthLock = require("./truthLock");
const { enrichWithMemory, storeAIInteraction } = require("./memoryBridge");
const { injectPersona, buildPersonaContext } = require("./personalityBridge");

async function aiRouter({ message, userId = "anon", channel = "web", from = null }) {
  try {

    // 🧠 PERSONALITY INJECTION (HUMAN-LIKE CONTEXT)
    const personaPrompt = injectPersona({ userId, message });

    // 🧠 MEMORY ENRICHMENT
    const emotional = injectEmotion({ userId, message });
    const enriched = await enrichWithMemory({ userId, message: emotional });({
      userId,
      message: personaPrompt
    });

    // 🤖 AI CORE
    const raw = await internalAI(enriched);
    const locked = truthLock(raw);

    // 🧠 UPDATE PERSONALITY STATE
    await buildPersonaContext({
      userId,
      message,
      response: locked
    });

    // 💾 STORE MEMORY
    await storeAIInteraction({
      userId,
      message,
      response: locked,
      channel
    });

    return locked;

  } catch (err) {
    console.error("AI Router Error:", err);
    return "⚡ System temporarily unavailable.";
  }
}

module.exports = aiRouter;
