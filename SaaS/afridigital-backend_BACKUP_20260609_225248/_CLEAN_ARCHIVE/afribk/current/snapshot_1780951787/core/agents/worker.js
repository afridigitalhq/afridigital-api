const { safeExecute } = require('../tools/safeExecutor');

async function work(traceId, toolCall) {
  if (!toolCall?.tool) return null;

  return await safeExecute(
    traceId,
    toolCall.tool,
    toolCall.input
  );
}

module.exports = { work };
