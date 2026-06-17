
const infra = require('./infra.adapter.v6.1');

const REPLAY_KEY = 'replay_queue';

async function enqueue(item) {
  return infra.queuePush(REPLAY_KEY, item);
}

async function fetchBatch(limit = 10) {
  return infra.queuePop(REPLAY_KEY, limit);
}

module.exports = {
  enqueue,
  fetchBatch
};

