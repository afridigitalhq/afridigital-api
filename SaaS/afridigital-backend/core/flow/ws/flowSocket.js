const WebSocket = require('ws');
const bus = require('../../redis/streamBus');

const STREAM_KEY = 'flowgraph:stream';

function createFlowSocket(server) {
  const wss = new WebSocket.Server({ server });

  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.send(JSON.stringify({
      type: 'system',
      message: 'FlowSocket connected',
      timestamp: Date.now()
    }));

    ws.on('close', () => clients.delete(ws));
  });

  function broadcast(event) {
    const payload = JSON.stringify({
      type: 'flow.event',
      data: event
    });

    for (const ws of clients) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  // Redis Stream consumer (fanout bridge)
  async function startStreamBridge() {
    if (!bus || !bus.xread) {
      console.log('[FlowSocket] Redis stream not available, running WS-only mode');
      return;
    }

    let lastId = '$';

    setInterval(async () => {
      try {
        const result = await bus.xread(
          'BLOCK',
          0,
          'STREAMS',
          STREAM_KEY,
          lastId
        );

        if (!result) return;

        const [stream, messages] = result[0];

        for (const msg of messages) {
          lastId = msg[0];

          const raw = msg[1][1];
          const event = JSON.parse(raw);

          broadcast(event);
        }
      } catch (e) {
        console.log('[FlowSocket] stream error:', e.message);
      }
    }, 200);
  }

  startStreamBridge();

  console.log('🔷 Flow WebSocket Gateway ACTIVE');

  return wss;
}

module.exports = { createFlowSocket };
