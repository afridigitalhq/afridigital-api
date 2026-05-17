const { randomUUID } = require("crypto");

function afriTraceMiddleware(req, res, next) {
  const traceId = `AFRI_${Date.now()}_${randomUUID()}`;

  req.traceId = traceId;

  const start = Date.now();

  console.log(`\n[TRACE ${traceId}] REQUEST_START ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[TRACE ${traceId}] REQUEST_END status=${res.statusCode} duration=${duration}ms`);
  });

  next();
}

module.exports = afriTraceMiddleware;
