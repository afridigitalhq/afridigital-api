const mirror = require('./event.mirror');

/**
 * READ-ONLY HEALTH METRICS
 */
function computeHealth() {
  const events = mirror.all();

  const total = events.length;

  const errors = events.filter(e => e.type === "SYSTEM_ERROR").length;
  const aiReq = events.filter(e => e.type === "AI_REQUEST").length;
  const routes = events.filter(e => e.type === "ROUTE_DECISION").length;

  const errorRate = total ? errors / total : 0;

  let status = "HEALTHY";
  if (errorRate > 0.2) status = "DEGRADED";
  if (errorRate > 0.5) status = "CRITICAL";

  return {
    status,
    totalEvents: total,
    aiRequests: aiReq,
    routingEvents: routes,
    errorRate
  };
}

module.exports = { computeHealth };
