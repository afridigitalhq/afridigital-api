export function buildAnomalyOverlay(anomalies) {
  return (anomalies || []).map(a => ({
    node: a.node,
    severity: a.severity,
    pulse: a.type === "FAILURE_STREAK" ? "RED_PULSE" : "YELLOW_BLINK",
    label: a.type
  }));
}
