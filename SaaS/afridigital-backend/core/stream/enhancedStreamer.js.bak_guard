const { publishToken } = require("./tokenStream");
const { emitTyping } = require("./typingChannel");
const { callLLM } = require("../llm/provider");

/**
 * STREAM + TYPING COORDINATOR
 */
async function streamWithTyping(sessionId, prompt) {

  // TURN ON TYPING
  await emitTyping(sessionId, "on");

  const text = await callLLM(prompt);

  let buffer = "";

  for (const token of text) {

    buffer += token;

    await publishToken(sessionId, token);

    // keep typing alive every few tokens
    if (buffer.length % 8 === 0) {
      await emitTyping(sessionId, "on");
    }

    await new Promise(r => setTimeout(r, 15));
  }

  // TURN OFF TYPING
  await emitTyping(sessionId, "off");

  return text;
}

module.exports = { streamWithTyping };
