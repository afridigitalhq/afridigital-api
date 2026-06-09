const { getReplayBatch } = require('./replay.engine');

async function replayMetrics() {
  const queue = await getReplayBatch(50);

  return {
    queueSize: queue.length,
    oldest: queue[0]?.createdAt || null,
    retries: queue.reduce((sum, i) => sum + (i.attempts || 0), 0),
    status: queue.length > 0 ? 'active' : 'idle'
  };
}

module.exports = { replayMetrics };
