import { useMemo } from "react";

/**
 * Converts WS simulation data into GPU-friendly field
 */
export function useFieldAggregator(events) {
  return useMemo(() => {
    if (!events) return null;

    let totalHeat = 0;

    const nodes = events.map(e => {
      const heat = e.physics?.heat || 0;
      totalHeat += heat;

      return {
        id: e.id,
        x: e.physics?.velocity || 1,
        y: heat,
        intensity: heat / 100
      };
    });

    return {
      nodes,
      totalHeat
    };
  }, [events]);
}
