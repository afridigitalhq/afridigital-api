import { useEffect, useState } from "react";

export function useDagFeed(socket) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("dag:event", (payload) => {
      setNodes(payload.nodes || []);
    });

    return () => socket.off("dag:event");
  }, [socket]);

  return nodes;
}
