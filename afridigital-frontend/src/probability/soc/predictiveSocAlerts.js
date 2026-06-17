export function generatePredictiveAlerts(probState) {
  const alerts = [];

  for (const n of probState.nodes) {
    if (n.failureProbability > 0.7) {
      alerts.push({
        type: "PREDICTIVE_FAILURE_WARNING",
        node: n.node,
        message: "High probability of imminent failure",
        severity: "CRITICAL"
      });
    }

    if (n.stability === "DEGRADED") {
      alerts.push({
        type: "EARLY_DEGRADATION_SIGNAL",
        node: n.node,
        message: "System degradation trend detected",
        severity: "MEDIUM"
      });
    }
  }

  if (probState.systemRisk === "CRITICAL") {
    alerts.push({
      type: "GLOBAL_RISK_ALERT",
      message: "System-wide instability predicted",
      severity: "CRITICAL"
    });
  }

  return {
    alerts,
    mode: "PREDICTIVE_ALERT_SYSTEM"
  };
}
