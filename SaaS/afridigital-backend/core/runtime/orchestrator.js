const { callLLM } = require('../llm/client');
const { push, getContext } = require('../context/memory');
const { callTool } = require('../tools/call');

async function runOrchestrator({ userId, text }) {

  const context = getContext(userId);

  const prompt = `
You are an AI orchestration engine.

TOOLS AVAILABLE:
- echo(input)
- (future tools can be added)

USER CONTEXT:
${JSON.stringify(context)}

USER MESSAGE:
${text}

RULES:
- If tool needed respond JSON:
  { "tool": "name", "input": "..." }

- Else respond:
  { "reply": "..." }
`;

  const raw = await callLLM(prompt);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { reply: raw };
  }

  // TOOL LOOP (REAL ORCHESTRATION)
  if (parsed.tool) {
    const toolResult = await callTool(parsed.tool, parsed.input);

    const followUp = await callLLM(`
Tool result:
${JSON.stringify(toolResult)}

Now produce final user reply.
`);

    push(userId, { text });
    return { reply: followUp, toolResult };
  }

  push(userId, { text });

  return parsed;
}

module.exports = { runOrchestrator };
