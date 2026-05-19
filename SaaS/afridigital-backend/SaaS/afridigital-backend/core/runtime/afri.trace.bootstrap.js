const { randomUUID } = require("crypto");

if (!global.__AFRI_TRACE_ENABLED__) {
  global.__AFRI_TRACE_ENABLED__ = true;
  console.log("🧠 AFRI TRACE SYSTEM ACTIVE");
}

function logTrace(traceId, step, data = null) {
  console.log(`[TRACE ${traceId}] ${step}`, data || "");
}

function createTrace(req, res, next) {
  const traceId = `AFRI_${Date.now()}_${randomUUID()}`;
  req.traceId = traceId;
  logTrace(traceId, "WEBHOOK_RECEIVED", req.body);
  next();
}

module.exports = {
  createTrace,
  logTrace
};
