import { useEffect, useState } from "react";
import { createWSClient } from "../../core/live/wsClient";
import { bindLiveDagStream } from "../../../viz/runtime/liveDagRuntime";

export function useLiveDag() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const socket = createWSClient();

    bindLiveDagStream(socket, (event) => {
      if (event?.node) {
        setNodes(prev => {
          const updated = [...prev];
          updated.push(event);
          return updated.slice(-50); // keep last 50
        });
      }
    });

    return () => socket.close();
  }, []);

  return nodes;
}
