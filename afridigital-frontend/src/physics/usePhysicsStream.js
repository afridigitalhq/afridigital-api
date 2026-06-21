import { useEffect, useRef, useState } from "react";
import { computeForces } from "./forceEngine";

export function usePhysicsStream(wsUrl) {
  const [nodes, setNodes] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ref.current = ws;

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "FIELD_DIFF" || data.type === "FIELD_SNAPSHOT") {
        setNodes(prev => {
          const merged = data.data || data.updated || prev;
          return computeForces(merged);
        });
      }
    };

    return () => ws.close();
  }, [wsUrl]);

  return nodes;
}
