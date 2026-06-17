const { callLLM } = require("../llm/provider");

/**
 * 🧠 TOOL DECISION AGENT
 */
async function toolAgent(input) {

  const prompt = `
You are a tool routing agent.

User input:
${input}

Return ONLY JSON if tool is needed:
{
  "tool": "tool.name",
  "input": { }
}

OR return:
{ "tool": null }
`;

  const res = await callLLM(prompt);

  try {
    return JSON.parse(res);
  } catch {
    return { tool: null };
  }
}

module.exports = { toolAgent };
