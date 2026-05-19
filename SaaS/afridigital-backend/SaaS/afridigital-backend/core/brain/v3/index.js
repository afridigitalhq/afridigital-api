const { buildDecision } = require('./decision');
const queue = require('./queue');
const { formatResponse } = require('./formatter');

async function processMessage(req, res) {
  try {
    const task = buildDecision(req);
    const result = await queue.dispatch(task);

    const reply = formatResponse(result);

    return {
      reply: reply || "I couldn't process that."
    };

  } catch (e) {
    console.error("🔥 BRAIN_FAILURE:", e);

    return {
      reply: "System temporarily unavailable ⚠️"
    };
  }
}

module.exports = { processMessage };
