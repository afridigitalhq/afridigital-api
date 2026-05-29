function sseHeaders(res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
}

function send(res, token) {
  res.write(`data: ${JSON.stringify({ token })}\n\n`);
}

function done(res, payload) {
  res.write(`data: ${JSON.stringify({ done: true, payload })}\n\n`);
  res.end();
}

module.exports = { sseHeaders, send, done };
