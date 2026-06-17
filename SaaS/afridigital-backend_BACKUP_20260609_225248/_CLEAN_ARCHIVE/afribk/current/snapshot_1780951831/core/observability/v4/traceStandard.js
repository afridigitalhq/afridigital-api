const crypto = require("crypto");

function getTraceId(req = {}) {
  if (req.traceId) return req.traceId;

  const id =
    (req.headers && req.headers["x-trace-id"]) ||
    crypto.randomBytes(8).toString("hex");

  req.traceId = id;
  return id;
}

module.exports = { getTraceId };
