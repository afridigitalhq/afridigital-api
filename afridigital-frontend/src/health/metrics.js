export function computeHealth(events) {
  let total = events.length;
  let failed = 0;
  let slow = 0;
  let lastEvent = null;

  for (const e of events) {
    lastEvent = e;

    if (e.status === "FAILED") failed++;
    if (e.latency && e.latency > 1000) slow++;
  }

  const successRate = total ? ((total - failed) / total) * 100 : 100;

  return {
    totalEvents: total,
    failedEvents: failed,
    slowEvents: slow,
    successRate: successRate.toFixed(2),
    lastEventTime: lastEvent?.ts || null,
    systemState:
      successRate > 90 ? "HEALTHY" :
      successRate > 70 ? "DEGRADED" :
      "CRITICAL"
  };
}
