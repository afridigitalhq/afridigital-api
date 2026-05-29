const { streamToken, flushStream } = require("../stream/bridgeStream");

/**
 * Simulated streaming LLM output
 * (replace later with real token stream API)
 */
async function streamLLMResponse(text, userId, onChunk) {

  const response = `AI: ${text}`;

  for (const char of response) {
    await new Promise(r => setTimeout(r, 10));

    streamToken(userId, char);
    onChunk?.(char);
  }

  return flushStream(userId);
}

module.exports = { streamLLMResponse };
