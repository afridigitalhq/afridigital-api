const memory = require('../memory/store');
const { pushEvent } = require('../stream/sse');

async function fakeStream(text, userId) {
  const tokens = text.split(" ");

  for (const t of tokens) {
    await new Promise(r => setTimeout(r, 120));

    pushEvent(userId, {
      type: "token",
      value: t + " "
    });
  }

  pushEvent(userId, { type: "done" });
}

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
  } catch {
    return null;
  }
}

function fallback(text) {
  return `Echo: ${text}`;
}

async function runBrain(payload = {}) {
  const userId = payload.from || "anon";
  const text = payload.text || "";

  const ctx = memory.getContext(userId);
  memory.pushMessage(userId, { text });

  const prompt = `User: ${text}\nContext: ${JSON.stringify(ctx)}`;

  const llm = await callLLM(prompt);

  const reply = llm || fallback(text);

  // STREAMING OUTPUT
  fakeStream(reply, userId);

  return {
    mode: llm ? "llm-stream" : "fallback-stream",
    memorySize: ctx.messages?.length || 0
  };
}

module.exports = { runBrain };
