const { processAI } = require("./core.pipeline.cjs");

function handleMessage(msg) {

  const result = processAI({
    text: msg.text,
    context: {
      intent: msg.intent || "general"
    }
  });

  return result;
}

module.exports = { handleMessage };
