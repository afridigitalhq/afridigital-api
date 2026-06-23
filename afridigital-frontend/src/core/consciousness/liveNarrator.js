// PHASE 3: CONSCIOUSNESS NARRATION LAYER

export function narrate(state) {
  if (state.mode === "rest") return "System stabilized in REST mode";
  if (state.risk === "critical") return "Warning: DAG instability detected";
  return "System operating within cognitive thresholds";
}
