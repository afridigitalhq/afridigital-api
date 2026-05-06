const internalAI = require("./internal");
const externalAI = require("./external");
const truthLock = require("./truthLock");
const chatMemory = require("../../services/memory/chatMemory");

async function aiRouter({ message, channel = "web", from = null }) {
  try {
    // 🧠 STEP 1: Load memory context
    const memoryContext = await chatMemory.getContext(from || channel);

    const enrichedMessage = memoryContext
      ? `${memoryContext}\n\nUser: ${message}`
      : message;

    // 🌐 STEP 2: Try internal AI first
    let response = await internalAI(enrichedMessage);

    // 🌍 STEP 3: fallback to external AI if needed
    if (!response) {
      response = await externalAI(enrichedMessage);
    }

    // 🔒 STEP 4: truth lock (final safety layer)
    const locked = truthLock(response || "⚡ No response generated.");

    // 💾 STEP 5: store memory
    await chatMemory.store(from || channel, message, locked);

    return locked;
  } catch (err) {
    console.error("AI Router Error:", err);
    return "⚡ System temporarily unavailable.";
  }
}

module.exports = aiRouter;
