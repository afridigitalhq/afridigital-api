const { executeFlow } = require('../../flow/engine/runtime.v3');
const { classifyOutcome } = require('../../kernel/outcome.v3');
const { enqueueReplay } = require('../../kernel/replay.memory.v6');

async function handleMessage(payload) {
  const result = await executeFlow(payload);
  const outcome = classifyOutcome(result);

  if (outcome.type === 'failure' && outcome.retryable) {
    await enqueueReplay({ payload });
  }

  return { ok: outcome.type === 'success', flow: result.flow, result, outcome };
}

module.exports = { handleMessage };
