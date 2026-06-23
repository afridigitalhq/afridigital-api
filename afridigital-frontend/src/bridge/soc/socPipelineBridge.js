// SOC PIPELINE WIRING (PHASE 2 AI SOC CORE)

import { processSOCStream } from "../../integrations/soc/socDashboardBridge";

export function buildSOCView(events) {
  return {
    incidents: processSOCStream(events),
    summary: {
      critical: events.filter(e => e.type === "ws_fail").length,
      warnings: events.filter(e => e.type === "dag_spike").length
    }
  };
}
