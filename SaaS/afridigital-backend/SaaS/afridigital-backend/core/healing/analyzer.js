/**
 * 🔍 FAILURE DETECTOR (A3.11)
 */

function detectFailure(events) {
  let routeFailures = 0;
  let missingExec = false;
  let lastType = null;

  for (const e of events.slice(-100)) {
    if (e.type === "ROUTE" && !e.payload) routeFailures++;
    if (e.type === "EXECUTE") missingExec = false;
    if (e.type === "ROUTE") lastType = "ROUTE";
    if (lastType === "ROUTE" && e.type !== "EXECUTE") missingExec = true;
  }

  const failed = routeFailures > 5 || missingExec;

  return {
    failed,
    routeFailures,
    missingExec,
    severity:
      routeFailures > 10 ? "CRITICAL" :
      failed ? "WARNING" : "NONE"
  };
}

module.exports = { detectFailure };
