import { forecastFailures } from "./failureForecast";
import { buildHeatmap } from "../heatmap/performanceHeatmap";
import { generateAlerts } from "../alerts/alertEngine";
import { explainSystem } from "../explain/systemExplain";

export function runIntelligenceLayer({ events, anomalies, rca, health }) {
  const forecast = forecastFailures(events);
  const heatmap = buildHeatmap(events);
  const alerts = generateAlerts(events, anomalies);

  const explanation = explainSystem({
    health,
    rca,
    forecast,
    alerts
  });

  return {
    forecast,
    heatmap,
    alerts,
    explanation
  };
}
