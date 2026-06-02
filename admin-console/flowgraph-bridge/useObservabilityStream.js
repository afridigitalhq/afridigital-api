import { useEffect, useRef } from "react";

/**
 * CONNECTS FLOWGRAPH TO RENDER OBSERVABILITY STREAM
 */
export function useObservabilityStream(onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://afridigital-fmdash.onrender.com"
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🌐 Observability stream connected");
    };

    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        onEvent({
          type: data.type,
          traceId: data.traceId,
          payload: data.payload
        });
      } catch (e) {
        console.warn("Stream parse error", e);
      }
    };

    socket.onerror = (err) => {
      console.warn("FlowGraph stream error", err);
    };

    return () => socket.close();
  }, [onEvent]);

  return socketRef;
}
