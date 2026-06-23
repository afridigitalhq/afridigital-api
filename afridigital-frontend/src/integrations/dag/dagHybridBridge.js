// PHASE 2 → DAG INTEGRATION BRIDGE

import { detectMode } from "../../core/mode/hybridModeController";
import { predictFailure } from "../../core/predictive/dagPredictor";

export function enhanceDag(nodes, systemState) {
  const mode = detectMode(systemState);
  const prediction = predictFailure(systemState.dag || {});

  return {
    mode,
    risk: prediction.risk,
    nodes: nodes.map(n => ({
      ...n,
      intensity: prediction.risk,
      glow: mode === "live" ? 1 : 0.4,
      degraded: mode === "rest"
    }))
  };
}
