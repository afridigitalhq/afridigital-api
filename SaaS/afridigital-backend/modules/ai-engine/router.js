const internalAI = require("./internal");
const externalAI = require("./external");
const truthLock = require("./truthLock");

let chatMemory;
try {
  chatMemory = require("../../services/memory/chatMemory");
} catch (e) {
  chatMemory = null;
}

async function aiRouter({ message, channel = "web", from = null }) {
  try {
    let memoryContext = "";

    // 🧠 SAFE MEMORY ACCESS (NEVER BREAK FLOW)
    if (chatMemory?.getContext) {
      try {
        memoryContext = await chatMemory.getContext(from || channel);
      } catch (e) {
        memoryContext = "";
      }
    }

    const finalMessage = memoryContext
      ? `${memoryContext}\n\nUser: ${message}`
      : message;

    // 🧠 INTERNAL AI FIRST
    let response = await internalAI(finalMessage);

    // 🌐 EXTERNAL FALLBACK
    if (!response) {
      response = await externalAI(finalMessage);
    }

    // 🔒 FINAL SAFETY LAYER
    const locked = truthLock(response || "⚡ No response generated.");

    // 💾 SAFE MEMORY STORE
    if (chatMemory?.store) {
      try {
        await chatMemory.store(from || channel, message, locked);
      } catch (e) {
        // ignore memory failure (non-blocking)
      }
    }

    return locked;
  } catch (err) {
    console.error("AI Router Fatal:", err);
    return "⚡ System temporarily unavailable.";
  }
}

module.exports = aiRouter;
