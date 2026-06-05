const bus = require('../../redis/streamBus');

const STREAM_KEY = 'flowgraph:stream';

function emitFlowEvent(event) {
  const payload = {
    id: 'evt_' + Date.now(),
    timestamp: Date.now(),
    ...event
  };

  try {
    // Redis stream fanout (primary path)
    if (bus && bus.xadd) {
      bus.xadd(STREAM_KEY, '*', 'data', JSON.stringify(payload));
    } else if (bus && bus.publish) {
      // fallback pub/sub
      bus.publish(STREAM_KEY, payload);
    }
  } catch (e) {
    console.log('[FlowStream] fallback mode:', e.message);
  }

  return payload;
}

function attachFlowStream(app) {

  app.get('/flow/emit', (req, res) => {
    const event = emitFlowEvent({
      node: 'API',
      action: 'manual_emit',
      status: 'running'
    });

    res.json(event);
  });

  app.get('/flow/stream/health', (req, res) => {
    res.json({
      ok: true,
      engine: 'flowgraph-stream',
      redis: !!bus,
      stream: STREAM_KEY
    });
  });

}

module.exports = {
  emitFlowEvent,
  attachFlowStream
};
