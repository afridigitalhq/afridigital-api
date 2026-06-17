export function generateAlerts(events, anomalies) {
  const alerts = [];

  for (const e of events) {
    if (e.latency > 1500) {
      alerts.push({
        type: "LATENCY_ALERT",
        severity: "HIGH",
        node: e.node,
        message: "Execution delay exceeded threshold"
      });
    }

    if (e.status === "FAILED") {
      alerts.push({
        type: "FAILURE_ALERT",
        severity: "CRITICAL",
        node: e.node,
        message: "Node execution failure detected"
      });
    }
  }

  for (const a of anomalies || []) {
    alerts.push({
      type: "ANOMALY_ALERT",
      severity: a.severity || "MEDIUM",
      message: a.type
    });
  }

  return alerts;
}
