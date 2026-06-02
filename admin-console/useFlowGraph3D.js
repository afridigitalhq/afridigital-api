import { useEffect, useState } from "react";

export default function useFlowGraph3D() {
  const [scene, setScene] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const ws = new EventSource("/realtime/flowgraph");

    ws.onmessage = (e) => {
      setScene(JSON.parse(e.data));
    };

    return () => ws.close();
  }, []);

  return scene;
}
