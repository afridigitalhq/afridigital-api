/**
 * STREAM EMITTER v1
 * Simple event-driven streaming layer (SSE compatible)
 */

function createStream(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  function send(event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  function end() {
    res.end();
  }

  return { send, end };
}

module.exports = {
  createStream
};
