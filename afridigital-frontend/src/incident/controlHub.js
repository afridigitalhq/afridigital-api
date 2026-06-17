import { generateIncidentSuggestions } from "./incidentResponder";
import { buildSecurityView } from "../soc/securityDashboard";
import { buildFederationState } from "../federation/dagFederation";
import { buildExecutionTrace } from "../trace/deepTrace";

export function runControlPlane({
  events,
  alerts,
  anomalies,
  rca,
  forecast,
  regions,
  nodeId
}) {
  return {
    incidents: generateIncidentSuggestions({ alerts, rca, forecast }),
    security: buildSecurityView(events, alerts, anomalies),
    federation: buildFederationState(regions || []),
    trace: buildExecutionTrace(events, nodeId)
  };
}
