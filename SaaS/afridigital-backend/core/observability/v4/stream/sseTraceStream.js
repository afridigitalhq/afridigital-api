const bus = require('../../../eventbus');

/**
 * AFRI SSE TRACE STREAM (CLEAN IMPLEMENTATION)
 * Stable real-time bridge: bus → frontend dashboard
 */

function registerDashboardStream(app) {

  app.get('/trace-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const send = (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    const aiHandler = (data) => send({ type: 'ai_event', data });
    const workerHandler = (data) => send({ type: 'worker_event', data });
    const waHandler = (data) => send({ type: 'whatsapp_event', data });

    bus.on('ai_event', aiHandler);
    bus.on('worker_event', workerHandler);
    bus.on('whatsapp_event', waHandler);

    req.on('close', () => {
      bus.off('ai_event', aiHandler);
      bus.off('worker_event', workerHandler);
      bus.off('whatsapp_event', waHandler);
    });
  });

  console.log('🔷 SSE DASHBOARD STREAM READY');
}

module.exports = { registerDashboardStream };
