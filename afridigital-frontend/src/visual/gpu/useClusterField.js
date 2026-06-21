import { useMemo } from "react";

/**
 * visual cluster gravity field (no backend dependency)
 */
export function useClusterField(nodes) {
  return useMemo(() => {
    if (!nodes) return [];

    return nodes.map(n => {
      const heat = n.physics?.heat || 0;

      return {
        id: n.id,

        // visual gravity pull (not physics engine)
        gravity: {
          pull: heat * 0.02,
          repel: heat > 80 ? 1.5 : 0.2
        },

        glow: Math.min(1, heat / 100)
      };
    });
  }, [nodes]);
}
