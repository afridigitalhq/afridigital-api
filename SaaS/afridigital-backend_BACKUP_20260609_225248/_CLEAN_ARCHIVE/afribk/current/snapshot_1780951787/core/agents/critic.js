const { callLLM } = require("../llm/provider");

/**
 * CRITIC AGENT
 * - improves response quality
 */
async function critic(response, plan) {

  const prompt = `
You are a critic agent.

Improve this response:

Response:
${response}

Plan:
${JSON.stringify(plan)}

Return improved version only.
`;

  return await callLLM(prompt);
}

module.exports = { critic };
