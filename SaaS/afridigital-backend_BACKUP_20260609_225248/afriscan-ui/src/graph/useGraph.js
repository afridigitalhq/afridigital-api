import { useEffect, useState } from "react";
import { connectAFRISCAN } from "../core/socket";

export const useGraph = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const ws = connectAFRISCAN((event) => {
      setNodes((prev) => [
        {
          id: Date.now(),
          type: event.type,
          payload: event.payload,
          ts: event.ts
        },
        ...prev.slice(0, 49)
      ]);
    });

    return () => ws.close();
  }, []);

  return nodes;
};
