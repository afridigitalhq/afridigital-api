/**
 * FLOWGRAPH VISUAL CORTEX SOCKET BRIDGE (READ-ONLY)
 * Connects backend event stream → 3D renderer engine
 */

export function createFlowSocket(engine, url) {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("🌐 FlowGraph socket connected");
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      engine.ingest({
        type: data.event,
        traceId: data.payload?.traceId || "unknown",
        payload: data.payload
      });

    } catch (e) {
      console.error("FlowGraph socket parse error", e);
    }
  };

  socket.onerror = (err) => {
    console.error("FlowGraph socket error", err);
  };

  socket.onclose = () => {
    console.log("🔌 FlowGraph socket disconnected");
  };

  return socket;
}
