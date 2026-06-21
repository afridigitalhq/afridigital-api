import { useMemo } from "react";

export function useStableReactFlow(nodes) {
  return useMemo(() => {
    if (!nodes) return [];

    return nodes.map((n) => ({
      id: n.id,
      position: {
        x: (n.physics?.velocity || 1) * 90,
        y: (n.physics?.heat || 0) * 6
      },
      data: {
        label: `🔥 ${n.type || "node"}`
      },
      style: {
        background: `rgba(255,0,0,${Math.min(
          0.8,
          (n.physics?.heat || 0) / 100
        )})`,
        border: "1px solid rgba(255,80,80,0.5)"
      }
    }));
  }, [nodes]);
}
