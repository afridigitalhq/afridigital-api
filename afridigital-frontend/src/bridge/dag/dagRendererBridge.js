// DAG RENDERER INTELLIGENCE WIRE (PHASE 2)

import { enhanceDag } from "../../integrations/dag/dagHybridBridge";

export function buildDagFrame(nodes, systemState) {
  const enhanced = enhanceDag(nodes, systemState);

  return {
    nodes: enhanced.nodes.map(n => ({
      ...n,
      color: n.degraded ? "#444" : "#00c2ff",
      pulse: enhanced.risk,
      glowIntensity: n.glow
    })),
    mode: enhanced.mode,
    risk: enhanced.risk
  };
}
