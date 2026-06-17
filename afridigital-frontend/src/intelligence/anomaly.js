export function detectAnomalies(events) {
  const anomalies = [];

  let failureStreak = 0;

  for (const e of events) {
    if (e.type === "NODE_UPDATE" && e.status === "FAILED") {
      failureStreak++;
    } else {
      failureStreak = 0;
    }

    if (failureStreak >= 3) {
      anomalies.push({
        type: "FAILURE_STREAK",
        severity: "HIGH",
        message: "Consecutive node failures detected"
      });
    }

    if (e.latency && e.latency > 1000) {
      anomalies.push({
        type: "LATENCY_SPIKE",
        severity: "MEDIUM",
        node: e.node
      });
    }
  }

  return anomalies;
}
