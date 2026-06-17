export function bindLiveDag(socket, onNodes, onEvents, onHeatmap) {
  if (!socket) return;

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "dag:event") {
        onNodes?.(data.nodes || []);
      }

      if (data.type === "dag:timeline") {
        onEvents?.(data.events || []);
      }

      if (data.type === "region:heatmap") {
        onHeatmap?.(data.regions || []);
      }

    } catch (e) {}
  };
}
