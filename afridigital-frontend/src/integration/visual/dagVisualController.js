// 🎥 DAG VISUAL CONTROLLER (REAL-TIME DEFORMATION LAYER)

import { mapSOCToVisual } from "../soc/socToVisualBridge";

let visualState = {
  stress: 0,
  heat: 0,
  pulse: 0
};

export function applySOCToDAG(sceneNodes, socEvent) {
  const v = mapSOCToVisual(socEvent);

  visualState = v;

  for (const node of sceneNodes) {
    // inject physics distortion
    node.x += (Math.random() - 0.5) * v.nodeStress * 10;
    node.y += (Math.random() - 0.5) * v.nodeStress * 10;

    node.glow = v.heat;
    node.pulse = v.pulse;
  }

  return sceneNodes;
}

export function getVisualState() {
  return visualState;
}
