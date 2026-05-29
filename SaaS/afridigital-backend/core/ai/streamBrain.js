const { runBrain } = require('./brain');

/**
 * STREAMING AI PIPELINE WRAPPER
 */

async function runStreamBrain(payload, stream) {

  stream.send("thinking", {
    stage: "start",
    text: payload.text
  });

  const result = await runBrain(payload);

  stream.send("memory", {
    size: result?.memorySize || 0
  });

  if (result?.graph) {
    stream.send("graph", result.graph);
  }

  stream.send("final", {
    reply: result.reply
  });

  return result;
}

module.exports = { runStreamBrain };
