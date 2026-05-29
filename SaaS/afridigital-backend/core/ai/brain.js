const memory = require('../memory/store');
const { pushEvent } = require('../stream/sse');

/**
 * STREAM PIPELINE V2 BRAIN
 * - bound execution to SSE
 * - deterministic + optional LLM hook
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
  } catch {
    return null;
  }
}

async function streamTokens(text, traceId) {
  const tokens = (text || "").split(" ");

  for (const t of tokens) {
    await new Promise(r => setTimeout(r, 80));

    pushEvent(traceId, {
      type: "token",
      value: t + " "
    });
  }
}

async function runBrain(payload = {}, traceId) {
  const userId = payload.from || "anon";
  const text = payload.text || "";

  const ctx = memory.getContext(userId);
  memory.pushMessage(userId, { text });

  const prompt = `User: ${text}\nContext: ${JSON.stringify(ctx)}`;

  const llm = await callLLM(prompt);

  const reply = llm || `Echo: ${text}`;

  // STREAM START
  pushEvent(traceId, { type: "start" });

  // TOKEN STREAM
  await streamTokens(reply, traceId);

  // FINAL EVENT
  pushEvent(traceId, {
    type: "done",
    memorySize: ctx.messages?.length || 0,
    mode: llm ? "llm" : "fallback"
  });

  return { ok: true };
}

module.exports = { runBrain };
