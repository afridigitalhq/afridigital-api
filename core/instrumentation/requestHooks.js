const { traceEvent } = require("./aiBrainBus");

function instrumentRequest(req, res, next) {
  const traceId = req.headers["x-trace-id"] || Math.random().toString(36).slice(2);

  req.traceId = traceId;

  traceEvent("ROUTE", "received", traceId, {
    path: req.path,
    method: req.method
  });

  res.on("finish", () => {
    traceEvent("ROUTE", "completed", traceId, {
      status: res.statusCode
    });
  });

  next();
}

module.exports = { instrumentRequest };
