export function attachFlowSocket(engine) {
  const socket = new WebSocket("wss://afridigital-fmdash.onrender.com");

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      engine.ingest({
        type: data.event,
        traceId: data.payload?.traceId,
        payload: data.payload
      });
    } catch (e) {
      console.error("FlowGraph parse error", e);
    }
  };

  return socket;
}
