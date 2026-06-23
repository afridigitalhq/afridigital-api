// PHASE 2 → SOC DASHBOARD ENGINE

import { classifyIncident } from "../../core/soc/incidentClassifier";

export function processSOCStream(eventStream = []) {
  return eventStream.map(event => ({
    ...event,
    severity: classifyIncident(event),
    timestamp: Date.now()
  }));
}
