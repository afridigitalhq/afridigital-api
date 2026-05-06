// A2 MEMORY ENABLED ROUTER HOOK READY
const { getRecentMemory } = require("../services/memory/chatMemory");
const { truthLock } = require("./truthLock");
const internalAI = require("./internal");

async function aiRouter({ message, channel = "web", from = null }) {
  try {
    const raw = await internalAI(message);
    return truthLock(raw);
  } catch (err) {
    console.error("AI Router Error:", err);
    return "⚡ System temporarily unavailable.";
  }
}

module.exports = aiRouter;
