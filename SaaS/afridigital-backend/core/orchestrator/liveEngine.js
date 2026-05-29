const { startStream, pushToken, finalizeStream } =
  require("../stream/bidirectionalStream");

/**
 * REAL TIME LLM STREAM SIMULATION
 * (replace later with real token streaming LLM)
 */
async function runLiveAI(userId, text) {

  await startStream(userId, "🤖 thinking...");

  const response = `AI RESPONSE: ${text}`;

  for (const ch of response) {
    await new Promise(r => setTimeout(r, 25));

    await pushToken(userId, ch);
  }

  await finalizeStream(userId);

  return response;
}

module.exports = { runLiveAI };
