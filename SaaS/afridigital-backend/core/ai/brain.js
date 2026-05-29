const memory = require('../memory/store');

/**
 * SAFE AI BRAIN v1
 * - no graph engine
 * - no tool execution
 * - safe LLM wrapper (optional)
 */

let callLLM = null;

// optional injection (if you later add LLM client)
try {
  callLLM = require('../llm/client').callLLM;
} catch (e) {
  console.log("🟡 LLM not loaded (safe fallback mode)");
}

/**
 * SIMPLE INTENT DETECTOR (cheap + safe)
 */
function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi")) return "greeting";
  if (t.includes("price") || t.includes("cost")) return "pricing";
  if (t.includes("help")) return "support";

  return "general";
}

/**
 * SAFE MEMORY UPDATE
 */
function updateMemory(userId, payload) {
  try {
    if (memory?.pushMessage) {
      memory.pushMessage(userId, payload);
    }
  } catch (err) {
    console.log("🟡 memory update skipped:", err.message);
  }
}

/**
 * SAFE LLM CALL
 */
async function safeLLM(prompt) {
  try {
    if (!callLLM) return null;
    return await callLLM(prompt);
  } catch (err) {
    console.log("🟡 LLM failed, fallback mode");
    return null;
  }
}

/**
 * CORE BRAIN FUNCTION
 */
async function runBrain(payload) {
  const userId = payload.from || "anonymous";
  const text = payload.text || "";

  const intent = detectIntent(text);

  // store memory safely
  updateMemory(userId, payload);

  // optional AI enhancement
  const llmResponse = await safeLLM(text);

  let reply;

  if (llmResponse) {
    reply = llmResponse;
  } else {
    // deterministic fallback brain
    switch (intent) {
      case "greeting":
        reply = "Hello 👋 how can I help you today?";
        break;

      case "pricing":
        reply = "Let me help you with pricing details. What exactly are you looking for?";
        break;

      case "support":
        reply = "I’m here to help. Tell me the issue.";
        break;

      default:
        reply = `Got it: ${text}`;
    }
  }

  return {
    reply,
    intent,
    memoryUpdated: true,
    llmUsed: !!llmResponse
  };
}

module.exports = { runBrain };
