
const guard = require('../guard/kernelGuard');
const store = require('../../stream/pollStreamStore');
const llm = require('../../llm/router');

async function run(payload) {
  const check = guard(payload?.event || 'api.ai');
  if (check.blocked) return check;

  const streamId = payload.streamId;
  const prompt = payload.text;

  if (streamId) store.pushEvent(streamId, { type: 'start' });

  await llm.stream({
    model: 'ollama',
    prompt,
    streamId,
    onToken: (t) => {
      store.pushEvent(streamId, { type: 'token', value: t });
    }
  });

  if (streamId) store.pushEvent(streamId, { type: 'done' });

  return { ok: true };
}

module.exports = { run };
