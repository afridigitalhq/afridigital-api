/**
 * STREAM EVENT EMITTER v1
 */

function createStream(res) {

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  function send(event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  function close() {
    res.end();
  }

  return { send, close };
}

module.exports = { createStream };
