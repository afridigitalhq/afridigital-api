const { executeFlow } = require('../flow/engine/runtime');

const replayQueue = [];

async function safeExecute(flowName, context = {}, options = {}) {
  const maxRetries = options.retries ?? 1;

  let lastError = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await executeFlow(flowName, context);

      if (!result) throw new Error('EMPTY_FLOW_RESULT');

      return {
        ok: true,
        flow: flowName,
        attempt: i + 1,
        result
      };

    } catch (err) {
      lastError = err;

      if (i < maxRetries) {
        await new Promise(r => setTimeout(r, 100 * (i + 1)));
      }
    }
  }

  replayQueue.push({ flowName, context, time: Date.now() });

  return {
    ok: false,
    flow: flowName,
    error: lastError?.message || 'UNKNOWN_ERROR',
    fallback: true,
    recovered: true
  };
}

function getReplayQueue() {
  return replayQueue;
}

function clearReplayQueue() {
  replayQueue.length = 0;
}

module.exports = {
  safeExecute,
  getReplayQueue,
  clearReplayQueue
};
