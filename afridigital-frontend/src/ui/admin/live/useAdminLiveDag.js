import { useEffect, useState } from "react";
import { createWS } from "../../../core/live/wsClient";
import { bindLiveDag } from "../../../viz/runtime/liveDagBridge";

export function useAdminLiveDag() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const socket = createWS();
    bindLiveDag(socket, setNodes);

    return () => socket.close();
  }, []);

  return nodes;
}
