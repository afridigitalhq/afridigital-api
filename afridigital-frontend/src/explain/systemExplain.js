export function explainSystem({ health, rca, forecast, alerts }) {
  const lines = [];

  lines.push(`System State: ${health.systemState}`);
  lines.push(`Success Rate: ${health.successRate}%`);

  if (forecast.prediction === "HIGH_RISK") {
    lines.push("Prediction: System instability expected soon.");
  } else {
    lines.push("Prediction: System operating within safe bounds.");
  }

  if (rca.causes?.length) {
    lines.push(`Primary Cause: ${rca.causes[0].type}`);
  }

  if (alerts.length) {
    lines.push(`Active Alerts: ${alerts.length}`);
  }

  return lines.join("\n");
}
