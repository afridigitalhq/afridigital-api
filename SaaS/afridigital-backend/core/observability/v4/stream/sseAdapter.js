const clients = new Set();

function bindSSETraceStream(bus) {
  if (global.__SSE_TRACE_BOUND__) return;
  global.__SSE_TRACE_BOUND__ = true;

  const forward = (type) => (payload) => {
    const msg = 'data: ' + JSON.stringify({ type, ts: Date.now(), ...payload }) + '\n\n';
    for (const res of clients) res.write(msg);
  };

  bus.on('http_request', forward('http'));
  bus.on('worker_event', forward('worker'));
  bus.on('ai_event', forward('ai'));

  console.log('🔗 SSE TRACE STREAM ACTIVE');
}

function traceRoute(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  res.write('data: {"status":"connected"}\n\n');
  clients.add(res);

  req.on('close', () => clients.delete(res));
}

module.exports = { bindSSETraceStream, traceRoute };
