const { callLLM } = require("../llm/provider");

/**
 * EXECUTOR AGENT
 * - generates actual response
 */
async function executor(plan, input) {

  const prompt = `
You are an execution agent.

Plan:
${JSON.stringify(plan)}

User:
${input}

Generate the best possible response.
`;

  return await callLLM(prompt);
}

module.exports = { executor };
