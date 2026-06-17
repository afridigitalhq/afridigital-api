export function buildSecurityView(events, alerts, anomalies) {
  const threats = [];

  for (const e of events) {
    if (e.suspicious === true) {
      threats.push({
        type: "SUSPICIOUS_EVENT",
        node: e.node,
        severity: "HIGH"
      });
    }

    if (e.rateLimitViolation) {
      threats.push({
        type: "RATE_LIMIT_ANOMALY",
        node: e.node,
        severity: "MEDIUM"
      });
    }
  }

  return {
    threatCount: threats.length,
    threats,
    alertCount: alerts?.length || 0,
    anomalyCount: anomalies?.length || 0,
    systemSecurityState:
      threats.length > 5 ? "UNDER_ATTACK" :
      threats.length > 0 ? "ELEVATED" :
      "CLEAN"
  };
}
