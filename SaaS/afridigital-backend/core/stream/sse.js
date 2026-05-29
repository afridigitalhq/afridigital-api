function sseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
}

function sendToken(res, token) {
  res.write(`data: ${JSON.stringify({ token })}\n\n`);
}

function endStream(res, data) {
  res.write(`data: ${JSON.stringify({ done: true, data })}\n\n`);
  res.end();
}

module.exports = { sseHeaders, sendToken, endStream };
