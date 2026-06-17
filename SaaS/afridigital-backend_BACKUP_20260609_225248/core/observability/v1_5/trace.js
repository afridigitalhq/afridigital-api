const { randomUUID } = require('crypto');

module.exports = function traceMiddleware(obs) {
  return function (req, res, next) {

    const traceId =
      req.headers['x-trace-id'] ||
      randomUUID();

    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    if (obs?.track) {
      obs.track('http_request', {
        traceId,
        method: req.method,
        path: req.path
      });
    }

    next();
  };
};
