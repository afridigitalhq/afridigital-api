const worker = require('../workers/a2Worker');
const drainer = require('../ai/gateway/v5/runtime/a2QueueDrainer');

function getRuntime() {
  return {
    worker: {
      active: !!worker,
      started: worker?.started || false
    },
    drainer: {
      active: !!drainer,
      started: drainer?.started || false
    }
  };
}

module.exports = { getRuntime };
