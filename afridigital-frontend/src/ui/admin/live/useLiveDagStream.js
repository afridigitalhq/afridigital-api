import { useEffect, useState } from "react";
import { createWS } from "../../../core/live/wsClient";
import { bindLiveDag } from "../../../viz/runtime/liveDagBridge";

export function useLiveDagStream() {
  const [nodes, setNodes] = useState([]);
  const [events, setEvents] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const socket = createWS();

    bindLiveDag(
      socket,
      setNodes,
      setEvents,
      setRegions
    );

    return () => socket.close();
  }, []);

  return { nodes, events, regions };
}
