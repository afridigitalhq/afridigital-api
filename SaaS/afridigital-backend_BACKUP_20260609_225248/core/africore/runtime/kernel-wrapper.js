const kernel = require('./kernel');
const streamWorker = require('../../workers/streamWorker');

async function run(payload) {
  const streamId = payload.streamId || Date.now().toString();

  streamWorker.push(streamId, { type: 'start' });

  const result = await kernel.run(payload);

  streamWorker.push(streamId, { type: 'token', value: result });

  streamWorker.push(streamId, { type: 'done' });

  return result;
}

module.exports = { run };
