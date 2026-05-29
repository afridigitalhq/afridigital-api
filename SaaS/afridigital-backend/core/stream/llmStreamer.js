const { publishToken } = require("./tokenStream");
const { callLLM } = require("../llm/provider");

/**
 * REAL STREAM SIMULATION OR LLM STREAM ADAPTER
 */
async function streamLLM(sessionId, prompt) {

  const text = await callLLM(prompt);

  for (const token of text) {

    await new Promise(r => setTimeout(r, 15));

    await publishToken(sessionId, token);
  }

  return text;
}

module.exports = { streamLLM };
