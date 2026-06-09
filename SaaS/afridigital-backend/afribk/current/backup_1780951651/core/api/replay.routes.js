const { getReplayBatch } = require('../kernel/replay.engine.v2');

module.exports = (app) => {
  app.get('/replay/status', async (req, res) => {
    const queue = await getReplayBatch(100);

    res.json({
      queueSize: queue.length,
      oldest: queue[0] || null,
      status: queue.length ? 'active' : 'idle'
    });
  });
};
