export function createFlowGraphBridge(engine) {
  if (!engine) throw new Error("FlowGraph engine required");

  return {
    attach(socket) {
      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          engine.ingest({
            type: data.type || data.event,
            traceId: data.traceId,
            payload: data.payload || data
          });
        } catch (e) {}
      };
    }
  };
}
