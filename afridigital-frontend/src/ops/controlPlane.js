import { buildIncidentReport } from "./report/incidentReport";
import { buildSOCView } from "./soc/socCommandCenter";
import { buildCausalGraph } from "./federation/causalGraph";
import { classifySecurityAnomalies } from "./classifier/securityML";

export function runControlPlaneOps({
  events,
  alerts,
  anomalies,
  rca,
  forecast,
  trace,
  regions,
  threats
}) {
  return {
    incidentReport: buildIncidentReport({
      health: forecast?.health || {},
      rca,
      forecast,
      alerts,
      trace
    }),

    soc: buildSOCView({
      events,
      alerts,
      anomalies,
      threats
    }),

    causalGraph: buildCausalGraph(regions || []),

    securityML: classifySecurityAnomalies(events)
  };
}
