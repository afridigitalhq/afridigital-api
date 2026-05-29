const { callLLM } = require("../llm/provider");

/**
 * PLANNER AGENT
 * - breaks request into strategy
 * - defines response shape
 */
async function planner(input) {

  const prompt = `
You are a planner agent.

User request:
${input}

Return JSON:
{
  "goal": "...",
  "steps": ["..."],
  "tone": "..."
}
`;

  const res = await callLLM(prompt);

  try {
    return JSON.parse(res);
  } catch {
    return {
      goal: input,
      steps: [],
      tone: "neutral"
    };
  }
}

module.exports = { planner };
