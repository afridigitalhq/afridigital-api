const crypto = require('crypto');
const { createSpan } = require('./context');
const { broadcast } = require('./stream');

module.exports = function obsV3(req, res, next) {
  const traceId = req.headers['x-request-id'] || crypto.randomUUID();

  const span = createSpan('http', traceId);

  req.trace = span;
  res.setHeader('x-request-id', traceId);

  res.on('finish', () => {
    broadcast({
      type: 'http',
      traceId,
      spanId: span.spanId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - span.ts
    });
  });

  next();
};
