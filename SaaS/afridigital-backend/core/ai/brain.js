const memory = require('../memory/store');

/**
 * SAFE AI BRAIN (NO CRASH GUARANTEE)
 * - deterministic fallback
 * - optional LLM hook
 */

async function callLLM(prompt) {
  try {
    if (!process.env.LLM_URL) return null;

    const res = await fetch(process.env.LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data?.text || null;
  } catch (e) {
    return null; // never crash
  }
}

function fallbackReply(text) {
  if (!text) return "I didn't understand that.";
  return `Echo: ${text}`;
}

async function runBrain(payload = {}) {
  const userId = payload.from || "anon";
  const text = payload.text || "";

  const context = memory.getContext(userId);
  memory.pushMessage(userId, { text });

  const prompt = `
User: ${text}
Context: ${JSON.stringify(context)}
`;

  const llm = await callLLM(prompt);

  const reply = llm || fallbackReply(text);

  return {
    reply,
    memorySize: context.messages?.length || 0,
    mode: llm ? "llm" : "fallback"
  };
}

module.exports = { runBrain };
