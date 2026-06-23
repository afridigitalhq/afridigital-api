// PHASE 3 → CONSCIOUSNESS UI LAYER

import { narrate } from "../../core/consciousness/liveNarrator";

export function generateNarration(systemState) {
  return {
    text: narrate(systemState),
    intensity:
      systemState.risk === "critical" ? "high" :
      systemState.risk === "warning" ? "medium" : "low"
  };
}
