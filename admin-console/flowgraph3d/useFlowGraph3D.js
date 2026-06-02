import { useEffect, useRef, useState } from "react";

export function useFlowGraph3D(socket) {
  const [graph, setGraph] = useState({ nodes: {}, edges: {} });

  useEffect(() => {
    if (!socket) return;

    socket.on("atlas.update", (data) => {
      setGraph(data);
    });

    return () => socket.off("atlas.update");
  }, [socket]);

  return graph;
}
