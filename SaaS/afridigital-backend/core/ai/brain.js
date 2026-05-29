const sse = require("../stream/sse");
const pushEvent = (id, evt) => sse.send(id, evt);
const memory = require('../memory/store');
const { pushEvent } = require('../stream/sse');

const { plan } = require('../agents/planner');
const { work } = require('../agents/worker');
const { review } = require('../agents/reviewer');

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
    await new Promise(r => setTimeout(r, 50));
    pushEvent(traceId, { type: "token", value: t + " " });
  }
}

async function runBrain(payload = {}, traceId) {
  const userId = payload.from || "anon";
  const text = payload.text || "";

  const ctx = memory.getContext(userId);
  memory.pushMessage(userId, { text });

  pushEvent(traceId, { type: "start", stage: "planner" });

  const planResult = plan(payload);

  pushEvent(traceId, {
    type: "plan",
    data: planResult
  });

  let finalOutput = null;

  // TOOL PATH
  if (planResult.intent === "tool_required") {

    pushEvent(traceId, { type: "stage", value: "worker" });

    const toolCall = {
      tool: "echo",
      input: text
    };

    const toolResult = await work(traceId, toolCall);

    pushEvent(traceId, {
      type: "tool_result",
      data: toolResult
    });

    const reviewed = review(toolResult);

    finalOutput = reviewed.text;
  }

  // CHAT PATH
  else {
    pushEvent(traceId, { type: "stage", value: "llm" });

    const llm = await callLLM(text);

    finalOutput = llm || `Echo: ${text}`;
  }

  pushEvent(traceId, { type: "stage", value: "reviewer" });

  const reviewed = review({
    ok: true,
    result: finalOutput
  });

  await stream(reviewed.text, traceId);

  pushEvent(traceId, {
    type: "done",
    mode: planResult.intent
  });

  return { ok: true };
}

module.exports = { runBrain };
