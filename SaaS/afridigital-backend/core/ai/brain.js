const memory = require('../memory/store');
const { pushEvent } = require('../stream/sse');
const { safeExecute } = require('../tools/safeExecutor');

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

async function stream(text, traceId) {
  const tokens = text.split(" ");

  for (const t of tokens) {
    await new Promise(r => setTimeout(r, 60));
    pushEvent(traceId, { type: "token", value: t + " " });
  }
}

async function runBrain(payload = {}, traceId) {
  const userId = payload.from || "anon";
  const text = payload.text || "";

  const ctx = memory.getContext(userId);
  memory.pushMessage(userId, { text });

  const prompt = `
User: ${text}
Context: ${JSON.stringify(ctx)}
Return either:
1) plain response
2) tool call JSON {tool, input}
`;

  const llm = await callLLM(prompt);

  // TOOL CALL PARSE (safe fallback)
  let toolCall = null;

  try {
    toolCall = llm ? JSON.parse(llm) : null;
  } catch {}

  pushEvent(traceId, { type: "start" });

  // TOOL EXECUTION PATH
  if (toolCall?.tool) {
    pushEvent(traceId, { type: "tool_call", tool: toolCall.tool });

    const result = await safeExecute(traceId, toolCall.tool, toolCall.input);

    pushEvent(traceId, {
      type: "tool_result",
      result
    });

    await stream(JSON.stringify(result), traceId);

    pushEvent(traceId, { type: "done", mode: "tool" });

    return;
  }

  // NORMAL RESPONSE PATH
  const reply = llm || `Echo: ${text}`;

  await stream(reply, traceId);

  pushEvent(traceId, {
    type: "done",
    mode: llm ? "llm" : "fallback"
  });
}

module.exports = { runBrain };
