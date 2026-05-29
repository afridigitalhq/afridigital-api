const memory = require('../memory/store');

const { buildContext } =
  require('../context/engine');

const {
  callLLM
} = require('../llm/client');

const toolDefinitions =
  require('../tools/definitions');

const {
  safeExecute
} = require('../tools/safeExecutor');

const {
  buildGraphFromLLM
} = require('../graph/builder');

const {
  createGraph,
  createExecution
} = require('../graph/store');

const {
  runGraph
} = require('../graph/executor');

function buildPrompt(payload, context) {
  return `
You are an AI backend agent.

AVAILABLE TOOLS:
${JSON.stringify(toolDefinitions, null, 2)}

USER MESSAGE:
${payload.text}

CONTEXT:
${JSON.stringify(context, null, 2)}

RULES:

You may respond in ONE of these formats:

1) Normal response
2) Tool call
3) GRAPH MODE (advanced execution flow):

GRAPH FORMAT:
\`\`\`json
{
  "graphId": "g1",
  "nodes": {
    "start": {
      "type": "tool",
      "tool": "pricingTool",
      "next": "end"
    },
    "end": {
      "type": "end"
    }
  }
}
\`\`\`

Use GRAPH MODE for multi-step workflows with branching.
`;
}

async function runBrain(payload) {

  const userId =
    payload.from || 'anonymous';

  const context =
    buildContext(userId);

  const prompt =
    buildPrompt(payload, context);

  const llmResponse =
    await callLLM(prompt);

  /**
   * STEP 1 — GRAPH MODE
   */
  const graph =
    buildGraphFromLLM(llmResponse);

  let graphResult = null;

  if (graph) {

    createGraph(graph.graphId, graph);

    const execId =
      `${graph.graphId}-${Date.now()}`;

    createExecution(execId, graph.graphId, {
      startedAt: Date.now()
    });

    graphResult =
      await runGraph(execId, userId);
  }

  /**
   * STEP 2 — FINAL RESPONSE
   */
  const finalPrompt = `
USER MESSAGE:
${payload.text}

GRAPH RESULT:
${JSON.stringify(graphResult, null, 2)}

INSTRUCTIONS:
- Summarize graph execution clearly
- If graph failed, explain safely
- Keep response concise
`;

  const finalReply =
    await callLLM(finalPrompt);

  memory.pushMessage(userId, payload);

  return {
    reply: finalReply,
    graph,
    graphResult
  };
}

module.exports = {
  runBrain
};
