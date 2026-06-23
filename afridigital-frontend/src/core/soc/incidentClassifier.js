// PHASE 2: AI SOC LAYER (SIMPLIFIED ENGINE)

export function classifyIncident(event) {
  if (event.type === "ws_fail") return "REALTIME_FAILURE";
  if (event.type === "dag_spike") return "DAG_OVERLOAD";
  if (event.type === "gpu_spike") return "RENDER_DEGRADATION";
  return "UNKNOWN_ANOMALY";
}
