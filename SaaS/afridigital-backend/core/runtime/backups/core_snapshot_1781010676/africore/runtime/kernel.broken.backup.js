const guard = require('../guard/kernelGuard');


undefined(streamId, event) {
  if (!streams.has(streamId)) streams.set(streamId, []);
  streams.get(streamId).push(event);
}

async function run(payload) {
  const streamId = payload.streamId;

  const check = guard(payload?.event || "api.ai");

  if (check.blocked) return check;

  pushEvent(streamId, { type: 'start' });

  const steps = ['hello', 'world processing', 'complete'];

  for (const step of steps) {
    pushEvent(streamId, { type: 'token', value: step });
  }

  pushEvent(streamId, { type: 'done' });

  return { ok: true, data: payload };
}

module.exports = { run };
