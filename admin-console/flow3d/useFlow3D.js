import { useEffect, useRef, useState } from "react";

export function useFlow3D(bus) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!bus) return;

    bus.on("AI_REQUEST", (e) => {
      setNodes((n) => [
        ...n,
        {
          id: e.traceId,
          type: "AI",
          load: e.payload?.load || 0.5,
          pulse: Math.random()
        }
      ]);
    });

    bus.on("ROUTE_LEARN", (e) => {
      setEdges((ed) => [
        ...ed,
        {
          from: e.payload.from,
          to: e.payload.to,
          weight: e.payload.weight || 0.5
        }
      ]);
    });

    return () => {};
  }, [bus]);

  return { nodes, edges };
}
