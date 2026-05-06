const internalAI = require("./internal");
const externalAI = require("./external");
const truthLock = require("./truthLock");
const { enrichWithMemory, storeAIInteraction } = require("./memoryBridge");

async function aiRouter({ message, userId = "anon", channel = "web", from = null }) {
  try {
    const enriched = await enrichWithMemory({ userId, message });

    const raw = await internalAI(enriched);
    const locked = truthLock(raw);

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
