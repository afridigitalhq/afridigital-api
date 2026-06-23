// 🧠 AFRIDIGITAL CORE CONTROLLER (MASTER ORCHESTRATOR)

import { pushSOCEvent } from "../soc/pipeline/socPipeline";
import { updateDAGState } from "../dag/bridge/dagBridge";

export function AfriDigitalCoreController(event) {
  // 1. Feed SOC
  pushSOCEvent(event);

  // 2. Update DAG visual state
  updateDAGState({
    type: event.type,
    severity: event.severity,
    impact: event.impact,
    timestamp: Date.now()
  });

  // 3. Predictive hook
  return {
    risk: event.severity === "critical" ? "HIGH" : "NORMAL",
    recommendation: "monitor"
  };
}
